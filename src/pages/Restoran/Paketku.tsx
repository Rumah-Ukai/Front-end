// Tryout.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Stack,
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

interface Material {
  type: string;
  title: string;
  url: string;
}

interface Attempt {
  id: number;
  user_id: number;
  tryout_id: string;
  attempt_number: number;
  grade: string | null;
  status: string;
  question_order: string;
  answer_order: string;
  start_time: string;
  submitted_at: string | null;
}

interface TryoutDetail {
  id: string;
  name: string;
  description: string;
  created_at: string;
  paket_id: string;
  materials?: Material[];
  attemptsAllowed?: number;
  timeLimit?: string;
  gradingMethod?: string;
}

export default function Tryout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tryoutId = searchParams.get('id');

  const [tryoutData, setTryoutData] = useState<TryoutDetail | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tryoutId) {
      setError('Tryout ID tidak ditemukan');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Unauthorized: token tidak ditemukan');
          setLoading(false);
          return;
        }

        // Fetch tryout detail
        const tryoutRes = await axios.get<TryoutDetail>(
          `http://localhost:3000/tryouts/${encodeURIComponent(tryoutId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTryoutData(tryoutRes.data);

        // Fetch quiz attempts user for this tryout
        const attemptRes = await axios.get<Attempt[]>(
          `http://localhost:3000/quizattempt/${encodeURIComponent(tryoutId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttempts(Array.isArray(attemptRes.data) ? attemptRes.data : []);
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil data tryout');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tryoutId]);

  // Start attempt (backend yang hitung attempt_number)
  const handleStartAttempt = useCallback(async () => {
    if (!tryoutData) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    try {
      // POST ke backend /quizattempt/start
      const postRes = await axios.post(
        'http://localhost:3000/quizattempt/start',
        { tryout_id: tryoutData.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const created = postRes.data as Attempt;

      // navigate ke halaman quiz dengan tryoutId + attempt_number
      navigate(`/quiz?tryoutId=${created.tryout_id}&attempt=${created.attempt_number}`);
    } catch (err) {
      console.error('Error starting attempt:', err);
      alert('Gagal memulai attempt');
    }
  }, [navigate, tryoutData]);

  const handleReviewAttempt = (attempt: Attempt) => {
    navigate(`/review/${attempt.tryout_id}/${attempt.attempt_number}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!tryoutData) return <Typography>Tidak ada data tryout</Typography>;

  return (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {tryoutData.name}
      </Typography>
      <Typography variant="body2">{tryoutData.description}</Typography>

      <Stack spacing={1}>
        <Typography>
          <strong>Created At:</strong> {tryoutData.created_at}
        </Typography>
        <Typography>
          <strong>Attempts Allowed:</strong> {tryoutData.attemptsAllowed ?? 3}
        </Typography>
        <Typography>
          <strong>Time Limit:</strong> {tryoutData.timeLimit ?? 'N/A'}
        </Typography>
        <Typography>
          <strong>Grading Method:</strong> {tryoutData.gradingMethod ?? 'N/A'}
        </Typography>
      </Stack>

      {tryoutData.materials && tryoutData.materials.length > 0 && (
        <>
          <Divider />
          <Typography variant="h5">Materials</Typography>
          <Stack spacing={1}>
            {tryoutData.materials.map((m, idx) => (
              <Button
                key={idx}
                variant="outlined"
                component="a"
                href={m.url}
                target="_blank"
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                {m.title} ({m.type})
              </Button>
            ))}
          </Stack>
        </>
      )}

      <Divider />
      <Typography variant="h5">Previous Attempts</Typography>

      <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Attempt #</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attempts.map((a) => (
              <TableRow key={`${a.tryout_id}-${a.attempt_number}`}>
                <TableCell>{a.attempt_number}</TableCell>
                <TableCell>{a.status}</TableCell>
                <TableCell>{a.grade ?? '-'}</TableCell>
                <TableCell>
                  {a.status === 'finished' ? (
                    <Button size="small" onClick={() => handleReviewAttempt(a)}>
                      Review
                    </Button>
                  ) : (
                    <Typography variant="body2">Ongoing</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Button variant="contained" onClick={handleStartAttempt}>
        Start New Attempt
      </Button>
    </Stack>
  );
}
