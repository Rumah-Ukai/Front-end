import { useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  Paper,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

interface Tryout {
  id: string;
  name: string;
  description: string;
  created_at: string;
  paket_id: string;
  pdf_url?: string;
}

interface QuizAttempt {
  grade: string | number | null;
}

export default function Paket() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<Record<string, boolean>>({});
  const [bestGrades, setBestGrades] = useState<Record<string, number>>({});

  const paketId = searchParams.get('id');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchTryouts = async () => {
      if (!paketId) {
        setError('Paket ID tidak ditemukan');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const tryoutRes = await axios.get('http://localhost:3000/tryouts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tryoutsArray = Array.isArray(tryoutRes.data) ? tryoutRes.data : [];
        const filteredTryouts = tryoutsArray.filter(
          (t: Tryout) => t.paket_id === paketId
        );
        setTryouts(filteredTryouts);

        const promises = filteredTryouts.map(async (t: Tryout) => {
          try {
            const res = await axios.get(
              `http://localhost:3000/quizattempt/${t.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const attemptsData = res.data || [];
            const hasAttempt = attemptsData.length > 0;

            const best = hasAttempt
              ? Math.max(
                  ...attemptsData.map(
                    (a: QuizAttempt) => Number(a.grade) || 0
                  )
                )
              : null;
            return { id: t.id, hasAttempt, bestGrade: best };
          } catch {
            return { id: t.id, hasAttempt: false, bestGrade: null };
          }
        });

        const results = await Promise.all(promises);
        const attemptMap: Record<string, boolean> = {};
        const gradeMap: Record<string, number> = {};
        results.forEach((r) => {
          attemptMap[r.id] = r.hasAttempt;
          if (r.bestGrade !== null) gradeMap[r.id] = r.bestGrade!;
        });
        setAttempts(attemptMap);
        setBestGrades(gradeMap);
      } catch (err) {
        console.error('Error fetching tryouts:', err);
        setError('Gagal mengambil data tryout');
      } finally {
        setLoading(false);
      }
    };

    fetchTryouts();
  }, [paketId]);

  const handleTryoutClick = (tryout: Tryout) => {
    navigate(`/tryouts?id=${tryout.id}`);
  };

  // ✅ Ganti ke navigate ke PdfView, bukan open langsung URL
  const handleOpenPdf = (tryoutId: string) => {
    navigate(`/pdfviewer?id=${tryoutId}`);
  };

  const getGradeColor = (grade: number): string => {
    if (grade >= 80) return theme.palette.success.main;
    if (grade >= 41) return theme.palette.info.main;
    return theme.palette.error.main;
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: 'primary.main' }}
      >
        Daftar Tryout Paket
      </Typography>

      {tryouts.length === 0 ? (
        <Typography>Tidak ada tryout untuk paket ini</Typography>
      ) : (
        <Stack spacing={2}>
          {tryouts.map((tryout) => (
            <Paper
              key={tryout.id}
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
              }}
            >
              {/* Kiri: judul + nilai terbaik (desktop/tablet) */}
              <Box sx={{ flex: 1, mb: isMobile ? 2 : 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {tryout.name}
                </Typography>

                {!isMobile &&
                  attempts[tryout.id] &&
                  bestGrades[tryout.id] !== undefined && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: getGradeColor(bestGrades[tryout.id]),
                        }}
                      >
                        {bestGrades[tryout.id]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Nilai Terbaik
                      </Typography>
                    </Box>
                  )}
              </Box>

              {/* Tombol */}
              <Stack
                direction={isMobile ? 'column' : 'row'}
                spacing={2}
                sx={{ width: isMobile ? '100%' : 'auto' }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleTryoutClick(tryout)}
                >
                  Buka Tryout
                </Button>

                {tryout.pdf_url && (
                  <Button
                    variant="outlined"
                    disabled={!attempts[tryout.id]}
                    onClick={() => handleOpenPdf(tryout.id)} // ✅ kirim id tryout
                  >
                    Buka PDF
                  </Button>
                )}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
