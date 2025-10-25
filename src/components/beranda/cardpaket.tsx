// src/pages/Paket/PaketGrid.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Stack,
  Pagination,
  Dialog,
  DialogContent,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { tokensSet } from '../../theme/tokens';

interface Shape {
  id: number;
  x: number;
  size: number;
  type: 'circle' | 'square' | 'triangle';
}

const GlobalShapes: Shape[] = Array.from({ length: 10 }).map((_, i) => {
  const types: Shape['type'][] = ['circle', 'square', 'triangle'];
  return {
    id: i,
    x: Math.random() * 100,
    size: 20 + Math.random() * 200,
    type: types[Math.floor(Math.random() * types.length)],
  };
});

const colorPool = [
  '#E74C3C',
  '#3498DB',
  '#2ECC71',
  '#9B59B6',
  '#F39C12',
  '#1ABC9C',
  '#34495E',
];
const shuffledColors = [...colorPool].sort(() => Math.random() - 0.5);
let colorIndex = 0;
const getUniqueColor = () => {
  if (colorIndex >= shuffledColors.length) colorIndex = 0;
  return shuffledColors[colorIndex++];
};

interface PackageCardProps {
  title: string;
  palette: typeof tokensSet.palette1;
}
function PackageCard({ title }: PackageCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [bgColor] = useState(getUniqueColor);

  return (
    <Stack
      ref={containerRef}
      style={{
        width: '100%',
        height: '140px',
        backgroundColor: bgColor,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {GlobalShapes.map((s) => {
        const baseStyle: React.CSSProperties = {
          left: `${s.x}%`,
          width: s.size,
          height: s.size,
          transform: 'translateX(-50%)',
          position: 'absolute',
        };

        let shapeEl;
        const isFilled = Math.random() > 0.5;

        if (s.type === 'circle') {
          shapeEl = (
            <div
              style={{
                ...baseStyle,
                borderRadius: '50%',
                border: isFilled ? 'none' : '3px solid white',
                background: isFilled ? 'white' : 'inherit',
              }}
            />
          );
        } else if (s.type === 'square') {
          shapeEl = (
            <div
              style={{
                ...baseStyle,
                border: isFilled ? 'none' : '3px solid white',
                background: isFilled ? 'white' : 'inherit',
              }}
            />
          );
        } else {
          shapeEl = (
            <div
              style={{
                ...baseStyle,
                width: 0,
                height: 0,
                borderLeft: `${s.size / 2}px solid transparent`,
                borderRight: `${s.size / 2}px solid transparent`,
                borderBottom: `${s.size}px solid white`,
                background: 'inherit',
              }}
            />
          );
        }

        if (!isMobile) {
          return (
            <motion.div
              key={s.id}
              style={baseStyle}
              initial={{ top: -250 }}
              animate={{ top: '200vh' }}
              transition={{
                duration: 18 + Math.random() * 30,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 100,
              }}
            >
              {shapeEl}
            </motion.div>
          );
        }

        return (
          <Stack
            key={s.id}
            style={{
              ...baseStyle,
              backgroundColor: bgColor,
              top: `${0 + Math.random() * 60}%`,
            }}
          />
        );
      })}

      <Stack
        height={'100%'}
        sx={{
          zIndex: 5,
          color: isMobile ? 'white' : bgColor,
          fontSize: '24px',
          fontWeight: 700,
          mixBlendMode: 'exclusion',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title}
      </Stack>
    </Stack>
  );
}

interface PaketItem {
  id: string;
  name: string;
  price: string;
  image?: string;
  detail1?: string;
  detail2?: string;
  detail3?: string;
  detail4?: string;
  detail5?: string;
  // tambahan: kapan ujiannya ditutup (ISO string)
  closed_at?: string | null;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

// Midtrans client key (frontend only) and snap script depending on mode
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '';
const MIDTRANS_SNAP_URL =
  import.meta.env.MODE === 'production'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';

export default function PaketGrid() {
  // const navigate = useNavigate();
  const [palette, setPalette] = useState(tokensSet.palette1); // default
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [items, setItems] = useState<PaketItem[]>([]);
  const [userPakets, setUserPakets] = useState<string[]>([]);
  const [selectedPaket, setSelectedPaket] = useState<PaketItem | null>(null);

  // processing id to prevent duplicate/parallel requests
  const [processingId, setProcessingId] = useState<string | null>(null);

  // midtrans script loaded flag
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [snapLoaded, setSnapLoaded] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // helper untuk format tanggal ke Indonesia
  const formatDateIndo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const isExpired = (closedAt: string) => {
    try {
      return new Date(closedAt) < new Date();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchUserTheme = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.tema && typeof data.tema === 'string' && data.tema in tokensSet) {
            setPalette(tokensSet[data.tema as keyof typeof tokensSet]);
          }
        } catch (error) {
          console.error('Error fetching user theme:', error);
        }
      }
    };

    const fetchPakets = async () => {
      try {
        const response = await fetch(`${API_BASE}/pakets`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching pakets:', error);
      }
    };

    const fetchUserPakets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUserPakets([]);
          return;
        }
        const response = await fetch(`${API_BASE}/user-pakets`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error('Failed to fetch user-pakets', response.status);
          setUserPakets([]);
          return;
        }

        const data: { id: string }[] = await response.json();
        setUserPakets(data.map((p) => p.id));
      } catch (error) {
        console.error('Error fetching user pakets:', error);
        setUserPakets([]);
      }
    };

    fetchUserTheme();
    fetchPakets();
    fetchUserPakets();
  }, []);

  const filteredItems = items.filter((item) => !userPakets.includes(item.id));
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const formatPrice = (price: string | number) => {
    const num = Number(price);
    if (num === 0) return 'Gratis';
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  // helper: load Midtrans snap.js only once
  const loadMidtransSnap = async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).snap) {
      setSnapLoaded(true);
      return;
    }
    // if already appended script element and still loading, wait until available
    const existing = document.getElementById('midtrans-snap-script');
    if (existing) {
      // wait until snap is available
      return new Promise<void>((resolve) => {
        const check = setInterval(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((window as any).snap) {
            clearInterval(check);
            setSnapLoaded(true);
            resolve();
          }
        }, 200);
      });
    }

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'midtrans-snap-script';
      script.src = MIDTRANS_SNAP_URL;
      script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
      script.async = true;
      script.onload = () => {
        setSnapLoaded(true);
        resolve();
      };
      script.onerror = (e) => {
        console.error('Failed to load Midtrans snap.js', e);
        reject(new Error('Gagal memuat Midtrans script'));
      };
      document.head.appendChild(script);
    });
  };

  const handleBeliPaket = async (paket: PaketItem) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Anda harus login');
      return;
    }

    if (processingId !== null) return; // some request in progress
    setProcessingId(paket.id);

    try {
      // 1) Ambil harga authoritative dari backend
      const detailResp = await fetch(`${API_BASE}/pakets/${paket.id}`);
      if (!detailResp.ok) {
        console.error('Gagal mendapatkan detail paket', detailResp.status);
        alert('Gagal mendapatkan detail paket. Coba lagi.');
        setProcessingId(null);
        return;
      }
      const latestPaket: PaketItem = await detailResp.json();
      const priceNum = Number(latestPaket.price || 0);

      // 2) Jika gratis => langsung minta backend menambah paket ke user
      if (priceNum === 0) {
        const res = await fetch(`${API_BASE}/user-pakets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paket_id: paket.id }),
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any = null;
        try {
          data = await res.json();
        } catch (err) {
          console.error('Response is not JSON', err);
          alert('Response server tidak valid');
          setProcessingId(null);
          return;
        }

        if (!res.ok) {
          const errMsg = data?.error || 'Terjadi kesalahan saat menambahkan paket gratis';
          alert(errMsg);
          setProcessingId(null);
          return;
        }

        // berhasil, update UI supaya paket tidak lagi tampil
        setUserPakets((prev) => (prev.includes(paket.id) ? prev : [...prev, paket.id]));
        setSelectedPaket(null);
        setSnackbarMsg(data.message || 'Paket berhasil ditambahkan!');
        setSnackbarOpen(true);
        setProcessingId(null);
        return;
      }

      // 3) Untuk paket berbayar => buat order_id unik dan panggil /create-transaction
      const orderId = `P-${paket.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const createBody = {
        order_id: orderId,
        gross_amount: priceNum,
        paket_id: paket.id,
        // customer_details bisa dikirim jika kamu punya data user
        customer_details: {},
        item_details: [
          {
            id: paket.id,
            price: priceNum,
            quantity: 1,
            name: paket.name,
          },
        ],
      };

      const createResp = await fetch(`${API_BASE}/create-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createBody),
      });

      if (!createResp.ok) {
        const txt = await createResp.text().catch(() => null);
        console.error('create-transaction failed', createResp.status, txt);
        alert('Gagal membuat transaksi. Coba lagi.');
        setProcessingId(null);
        return;
      }

      const createData = await createResp.json();
      const tokenMidtrans = createData.token;
      const redirectUrl = createData.redirect_url || createData.redirectUrl || createData.redirect;

      if (!tokenMidtrans && !redirectUrl) {
        console.error('create-transaction: token/redirect missing', createData);
        alert('Respons transaksi tidak valid dari server.');
        setProcessingId(null);
        return;
      }

      // 4) Jika backend mengembalikan redirect_url -> redirect (redirect flow)
      if (redirectUrl) {
        // NOTE: server already created order in DB (PENDING)
        window.location.href = redirectUrl;
        // don't reset processingId here, user will leave page
        return;
      }

      // 5) Popup mode -> load snap script lalu panggil snap.pay
      try {
        await loadMidtransSnap();
      } catch (err) {
        alert('Gagal memuat modul pembayaran. Coba lagi nanti.');
        setProcessingId(null);
        return;
      }

      // call snap.pay
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).snap.pay(tokenMidtrans, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: async (result: any) => {
          console.log('midtrans success', result);
          // UX: beri tahu user
          setSnackbarMsg('Pembayaran berhasil. Terima kasih!');
          setSnackbarOpen(true);
          setSelectedPaket(null);

          // OPTIONAL: panggil endpoint finalize (jika backend mendukung finalize via order_id)
          // backend juga akan menerima webhook Midtrans; ini hanya percobaan finalize cepat
          try {
            const finalizeResp = await fetch(`${API_BASE}/user-pakets`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ paket_id: paket.id, order_id: orderId }),
            });
            if (finalizeResp.ok) {
              // update local state supaya paket hilang
              setUserPakets((prev) => (prev.includes(paket.id) ? prev : [...prev, paket.id]));
            } else {
              // bisa diabaikan: webhook server akan menambahkan paket jika pembayaran settled
              console.warn('Finalize request not accepted by server');
            }
          } catch (e) {
            console.warn('Finalize request failed', e);
          }

          // reset processing id
          setTimeout(() => setProcessingId(null), 800);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPending: (result: any) => {
          console.log('midtrans pending', result);
          setSnackbarMsg('Pembayaran tertunda. Silakan selesaikan pembayaran.');
          setSnackbarOpen(true);
          // order masih PENDING on backend; webhook akan update nanti
          setTimeout(() => setProcessingId(null), 800);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (result: any) => {
          console.error('midtrans error', result);
          setSnackbarMsg('Terjadi kesalahan saat memproses pembayaran.');
          setSnackbarOpen(true);
          setTimeout(() => setProcessingId(null), 800);
        },
        onClose: () => {
          console.log('customer closed the popup without finishing the payment');
          setSnackbarMsg('Pembayaran dibatalkan.');
          setSnackbarOpen(true);
          setTimeout(() => setProcessingId(null), 800);
        },
      });
    } catch (error) {
      console.error('handleBeliPaket error', error);
      alert('Gagal memproses pembelian. Coba lagi.');
      setProcessingId(null);
    }
  };

  return (
    <Stack sx={{ width: '100%', alignItems: 'flex-start' }}>
      <Grid container spacing={2} sx={{ width: '100%' }}>
        {currentItems.length === 0 ? (
          <Grid item xs={12}>
            <Stack
              sx={{
                width: '100%',
                height: 200,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                bgcolor: palette.primary + '22',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: palette.primaryDark }}>
                Tidak ada paket yang tersedia
              </Typography>
            </Stack>
          </Grid>
        ) : (
          currentItems.map((item) => {
            const expired = item.closed_at ? isExpired(item.closed_at) : false;
            return (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    bgcolor: palette.primary,
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                    },
                    opacity: expired ? 0.9 : 1,
                  }}
                  onClick={() => setSelectedPaket(item)}
                >
                  {item.image ? (
                    <CardMedia component="img" height="140" image={item.image} alt={item.name} />
                  ) : (
                    <PackageCard title={item.name} palette={palette} />
                  )}

                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: palette.primaryContrastText }}>
                      {item.name}
                    </Typography>
 <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: palette.primaryContrastText }}>
                        {formatPrice(item.price)}
                      </Typography>
                    {/* {item.closed_at ? (
                      expired ? (
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            mt: 1,
                            color: palette.error,
                          }}
                        >
                          Ujian telah ditutup pada: {formatDateIndo(item.closed_at)}
                        </Typography>
                      ) : (
                        
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            mt: 1,
                            color: palette.warning,
                          }}
                        >
                          Tutup: {formatDateIndo(item.closed_at)}
                        </Typography>
                      )
                    ) : (
                      <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: palette.primaryContrastText }}>
                        {formatPrice(item.price)}
                      </Typography>
                    )} */}
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          size="large"
          sx={{
            mt: 4,
            alignSelf: 'center',
            '& .MuiPaginationItem-root': {
              color: palette.primaryDark,
              '&.Mui-selected': {
                backgroundColor: palette.primary,
                color: palette.primaryContrastText,
              },
              '&:hover': {
                backgroundColor: palette.primary + '33',
              },
            },
          }}
        />
      )}

      <Dialog open={!!selectedPaket} onClose={() => setSelectedPaket(null)} maxWidth="sm" fullWidth>
        {selectedPaket && (
          <DialogContent sx={{ borderRadius: '60px', backgroundColor: 'white' }}>
            <Card elevation={0}>
              {selectedPaket.image ? (
                <CardMedia component="img" height="200" image={selectedPaket.image} alt={selectedPaket.name} />
              ) : (
                <PackageCard title={selectedPaket.name} palette={palette} />
              )}
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: palette.btnSecondaryText }}>
                  {selectedPaket.name}
                </Typography>

                {[1, 2, 3, 4, 5].map((n) => {
                  const key = `detail${n}` as keyof PaketItem;
                  return (
                    selectedPaket[key] && (
                      <Typography
                        key={n}
                        variant="body1"
                        sx={{ mb: 1, color: palette.btnSecondaryText, fontWeight: 600 }}
                      >
                        • {selectedPaket[key]}
                      </Typography>
                    )
                  );
                })}

                {/* tampilkan informasi closed_at kalau ada */}
                {selectedPaket.closed_at && (
                  <>
                    {isExpired(selectedPaket.closed_at) ? (
                      <Typography variant="body1" sx={{ mb: 1, color: palette.error, fontWeight: 700 }}>
                        Ujian telah ditutup pada: {formatDateIndo(selectedPaket.closed_at)}
                      </Typography>
                    ) : (
                      <Typography variant="body1" sx={{ mb: 1, color: palette.warning, fontWeight: 700 }}>
                        Tutup: {formatDateIndo(selectedPaket.closed_at)}
                      </Typography>
                    )}
                  </>
                )}

                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, color: palette.btnSecondaryText }}>
                  {formatPrice(selectedPaket.price)}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: palette.primary,
                    color: palette.primaryContrastText,
                    '&:hover': { backgroundColor: palette.primaryLight },
                  }}
                  onClick={() => handleBeliPaket(selectedPaket!)}
                  disabled={processingId === selectedPaket.id}
                >
                  {processingId === selectedPaket.id ? <CircularProgress size={20} color="inherit" /> : 'Beli'}
                </Button>
              </CardContent>
            </Card>
          </DialogContent>
        )}
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
