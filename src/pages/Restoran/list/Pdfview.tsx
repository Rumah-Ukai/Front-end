import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Typography, Stack, IconButton } from '@mui/material';
import * as pdfjsLib from 'pdfjs-dist';
import { useSearchParams } from 'react-router-dom';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import type {
  PDFDocumentProxy,
  PDFPageProxy,
  RenderTask,
} from 'pdfjs-dist/types/src/display/api';

// Set worker manual dari /public/pdf.worker.min.js
(pdfjsLib as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc =
  '/pdf.worker.min.js';

export default function PdfView(): JSX.Element {
  const [searchParams] = useSearchParams();
  const tryoutId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.0);

  // refs: gunakan union dengan null supaya aman saat assignment
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  const containerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);

  // render tasks & observer untuk cleanup / cancel
  const renderTasksRef = useRef<Map<number, RenderTask>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // set of pages yang sudah berhasil dirender (index 0-based)
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());

  // cancel render task helper
  const cancelRenderTask = useCallback((index: number) => {
    const t = renderTasksRef.current.get(index);
    if (t) {
      try {
        t.cancel();
      } catch {
        // ignore cancel errors
      }
      renderTasksRef.current.delete(index);
    }
  }, []);

  // render satu halaman dengan mempertimbangkan rotation & devicePixelRatio
  const renderPage = useCallback(
    async (page: PDFPageProxy, index: number, renderScale: number) => {
      const container = containerRefs.current[index];
      if (!container) return;

      const rotation = page.rotate ?? 0;
      const viewport = page.getViewport({ scale: renderScale, rotation });

      const canvas = canvasRefs.current[index];
      if (!canvas) return;

      // batalkan task sebelumnya pada halaman ini (safety)
      cancelRenderTask(index);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // gunakan devicePixelRatio agar tetap tajam di HiDPI
      const outputScale = Math.max(1, window.devicePixelRatio || 1);

      // ukuran canvas (pixel)
      canvas.width = Math.ceil(viewport.width * outputScale);
      canvas.height = Math.ceil(viewport.height * outputScale);

      // ukuran tampilan CSS (CSS pixels)
      canvas.style.width = `${Math.ceil(viewport.width)}px`;
      canvas.style.height = `${Math.ceil(viewport.height)}px`;

      // pastikan container juga punya dimensi agar layout stabil
      container.style.width = `${Math.ceil(viewport.width)}px`;
      container.style.height = `${Math.ceil(viewport.height)}px`;

      // transform context supaya 1 unit PDF = 1 CSS pixel * outputScale
      ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const renderTask = page.render({
        canvasContext: ctx,
        viewport,
        canvas
      });

      renderTasksRef.current.set(index, renderTask as RenderTask);

      try {
        await (renderTask as RenderTask).promise;
        setRenderedPages((prev) => {
          if (prev.has(index)) return prev;
          const next = new Set(prev);
          next.add(index);
          return next;
        });
      } catch (err) {
        // jika dibatalkan, abaikan
        // console.debug('render cancelled/failed', index, err);
      } finally {
        renderTasksRef.current.delete(index);
      }
    },
    [cancelRenderTask],
  );

  // load & render page helper (ambil page dari pdfRef)
  const loadAndRenderPage = useCallback(
    async (index: number) => {
      const pdf = pdfRef.current;
      if (!pdf) return;
      try {
        const page = await pdf.getPage(index + 1);
        await renderPage(page, index, scale);
      } catch (err) {
        // ignore per-page error
        // console.error('load/render page', index, err);
      }
    },
    [renderPage, scale],
  );

  // fetch PDF dari backend
  useEffect(() => {
    if (!tryoutId) {
      setError('Tryout ID tidak tersedia');
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/pdf-proxy?tryoutId=${tryoutId}`);
        if (!response.ok) throw new Error(`Server responded dengan ${response.status}`);
        const arr = await response.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arr });
        const pdf = await loadingTask.promise;
        if (!mounted) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
      } catch (err) {
        console.error('Gagal memuat PDF', err);
        setError('Gagal memuat PDF');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tryoutId]);

  // setup IntersectionObserver untuk lazy load setelah elemen container ter-render
  useEffect(() => {
    if (!numPages || !pdfRef.current) return;

    // disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxAttr = (entry.target as HTMLElement).dataset.index;
            if (!idxAttr) return;
            const idx = Number(idxAttr);
            // jika belum dirender, load & render
            if (!renderedPages.has(idx)) {
              loadAndRenderPage(idx);
            }
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 },
    );

    // observe all current container refs (some may still be null if not mounted)
    containerRefs.current.forEach((c) => {
      if (c) io.observe(c);
    });

    observerRef.current = io;
    return () => {
      io.disconnect();
      observerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPages, loadAndRenderPage, renderedPages.size]); // depend on size to re-run when new pages rendered

  // re-render pages yang sudah pernah dirender ketika scale berubah
  useEffect(() => {
    if (!pdfRef.current) return;
    // rerender only pages that already were rendered
    renderedPages.forEach(async (index) => {
      cancelRenderTask(index);
      try {
        const page = await pdfRef.current!.getPage(index + 1);
        await renderPage(page, index, scale);
      } catch {
        // ignore
      }
    });
  }, [scale, renderedPages, renderPage, cancelRenderTask]);

  // cleanup on unmount: cancel tasks & disconnect observer
  useEffect(() => {
    return () => {
      renderTasksRef.current.forEach((task) => {
        try {
          task.cancel();
        } catch {
          // ignore
        }
      });
      renderTasksRef.current.clear();
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  // zoom controls -> hanya update scale (re-render di effect di atas)
  const handleZoomIn = () => setScale((s) => Math.min(s + 0.1, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.1, 0.5));

  return (
    <Box
      sx={{
        border: '1px solid #ddd',
        borderRadius: 2,
        overflow: 'auto',
        boxShadow: 1,
        position: 'relative',
        p: 2,
        maxWidth: '100%',
        maxHeight: '100vh',
      }}
    >
      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Memuat PDF, mohon menunggu...</Typography>
        </Stack>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Stack
          spacing={4}
          sx={{
            width: '100%',
          }}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Box
              key={index}
              data-index={index}
              ref={(ref: HTMLDivElement | null) => {
                containerRefs.current[index] = ref;
              }}
              sx={{
                border: '1px solid #ddd',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                display: 'inline-block',
                position: 'relative',
                width: '100%',
                maxWidth: 800,
                backgroundColor: '#fff',
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <canvas
                ref={(ref: HTMLCanvasElement | null) => {
                  canvasRefs.current[index] = ref;
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </Box>
          ))}
        </Stack>
      )}

      {/* Tombol Zoom */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          p: 1,
          boxShadow: 3,
        }}
      >
        <IconButton aria-label="zoom in" size="small" onClick={handleZoomIn}>
          <ZoomInIcon />
        </IconButton>
        <IconButton aria-label="zoom out" size="small" onClick={handleZoomOut}>
          <ZoomOutIcon />
        </IconButton>
        <Typography sx={{ fontSize: 12, textAlign: 'center', px: 0.5 }}>
          {(scale * 100).toFixed(0)}%
        </Typography>
      </Box>
    </Box>
  );
}
