// src/pages/Tryout.tsx
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
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  status: 'ongoing' | 'finished' | 'submitted' | 'graded';
  question_order: string; // comma-separated string like "2,6"
  answer_order: string;   // comma-separated string like "df,-" (may include 'f')
  start_time: string;
  submitted_at: string | null;
  duration_minutes?: number | null;
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
  duration_minutes?: number | null; // prefer duration here if present
}

interface QuestionRowFromServer {
  id: number;
  answer_key: string; // backend column name for correct answer (can be letter or numeric)
  // other fields ignored here
}

export default function Tryout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tryoutId = searchParams.get('id');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tryoutData, setTryoutData] = useState<TryoutDetail | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

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

        const tryoutRes = await axios.get<TryoutDetail>(
          `http://localhost:3000/tryouts/${encodeURIComponent(tryoutId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTryoutData(tryoutRes.data);

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

    void fetchData();
  }, [tryoutId]);

  const getRemainingSeconds = (att: Attempt): number => {
    // Prefer tryout duration or attempt.duration_minutes; attempt.duration_minutes may be null
    const duration = att.duration_minutes ?? tryoutData?.duration_minutes;
    if (!att || !att.start_time || typeof duration === 'undefined' || duration === null) return 0;
    const start = new Date(att.start_time).getTime();
    const total = duration * 60 * 1000;
    const elapsed = Math.max(0, now - start);
    const remainingMs = total - elapsed;
    return Math.ceil(remainingMs / 1000);
  };

  const formatHMS = (secTotal: number) => {
    if (secTotal <= 0) return '00:00:00';
    const s = Math.max(0, secTotal);
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = Math.floor(s % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  };

  const fetchAttempts = useCallback(async () => {
    if (!tryoutId) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const attemptRes = await axios.get<Attempt[]>(
        `http://localhost:3000/quizattempt/${encodeURIComponent(tryoutId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttempts(Array.isArray(attemptRes.data) ? attemptRes.data : []);
    } catch (err) {
      console.error('Fetch attempts error', err);
    }
  }, [tryoutId]);

  const finishAttempt = async (a: Attempt, grade?: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const patchData: Partial<Pick<Attempt, 'status' | 'submitted_at' | 'grade'>> = {
        status: 'finished',
        submitted_at: new Date().toISOString(),
      };
      if (grade !== undefined) patchData.grade = grade;

      const patchRes = await axios.patch<Attempt>(
        `http://localhost:3000/quizattempt/${encodeURIComponent(a.tryout_id)}/${encodeURIComponent(String(a.attempt_number))}`,
        patchData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return patchRes.data;
    } catch (err) {
      console.error('finishAttempt error', err);
      throw err;
    }
  };

  const handleStartAttempt = useCallback(async () => {
    if (!tryoutData || !tryoutId) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    const anyActive = attempts.some(a => a.status === 'ongoing' && getRemainingSeconds(a) > 0);
    if (anyActive) {
      alert('Masih ada attempt yang sedang berjalan. Selesaikan / tunggu sampai waktu habis dahulu.');
      return;
    }

    try {
      setLoading(true);
      const toFinish = attempts.filter(a => a.status === 'ongoing');
      if (toFinish.length > 0) {
        await Promise.all(toFinish.map(a => finishAttempt(a).catch(() => {})));
      }

      const postRes = await axios.post<Attempt>(
        'http://localhost:3000/quizattempt/start',
        { tryout_id: tryoutData.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const created = postRes.data;
      navigate(`/quiz?tryoutId=${created.tryout_id}&attempt=${created.attempt_number}`);
    } catch (err) {
      console.error('Error starting attempt:', err);
      alert('Gagal memulai attempt');
    } finally {
      setLoading(false);
      void fetchAttempts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempts, fetchAttempts, navigate, tryoutData, tryoutId]);

  const handleContinueAttempt = (a: Attempt) => {
    navigate(`/quiz?tryoutId=${a.tryout_id}&attempt=${a.attempt_number}`);
  };

  // ------------ grading: fetch all questions for tryout and compute score ------------
  const handleGradeAttempt = async (a: Attempt) => {
    const ok = window.confirm('Waktu habis untuk attempt ini. Lanjutkan untuk menandai selesai dan melakukan grading?');
    if (!ok) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      // parse question ids and user answers from DB CSV strings (they are CSV strings, not JSON)
      const questionIds = (a.question_order || '')
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => parseInt(s, 10)); // parseInt(...,10) -> 10 = radix (decimal)

      const userTokens = (a.answer_order || '')
        .split(',')
        .map(s => s.trim());

      // get all questions for this tryout in one request
      const qRes = await axios.get<QuestionRowFromServer[]>(
        `http://localhost:3000/questions?tryoutId=${encodeURIComponent(a.tryout_id)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const allQuestions = Array.isArray(qRes.data) ? qRes.data : [];

      // build map: id -> answer_key
      const answerKeyMap = new Map<number, string>();
      for (const q of allQuestions) {
        answerKeyMap.set(q.id, (q.answer_key ?? '').toString().trim());
      }

      // helper: letter -> numeric mapping (if DB stores numeric keys)
      const letterToNumber: Record<string, string> = { a: '1', b: '2', c: '3', d: '4', e: '5' };

      // compute score
      let correct = 0;
      for (let i = 0; i < questionIds.length; i++) {
        const qid = questionIds[i];
        const rawUserToken = (userTokens[i] ?? '').trim(); // may include 'f'
        const cleaned = rawUserToken.replace(/f/g, '').trim(); // remove flag markers

        // '-' or empty => not answered -> count as incorrect
        if (!cleaned || cleaned === '-') {
          continue;
        }

        const expected = answerKeyMap.get(qid);
        if (typeof expected === 'undefined') {
          // question not found in server results — skip (counts as incorrect)
          console.warn('Question id not found when grading:', qid);
          continue;
        }

        const expectedNorm = expected.toString().trim().toLowerCase();
        const userNorm = cleaned.toLowerCase();

        let matched = false;

        // If expected is numeric (e.g. "1","2"), compare either numeric or letter->number mapping
        if (/^\d+$/.test(expectedNorm)) {
          // if user answered by letter, map to number; otherwise compare directly
          if (/^[a-e]$/.test(userNorm)) {
            matched = (letterToNumber[userNorm] === expectedNorm);
          } else {
            matched = (userNorm === expectedNorm);
          }
        } else {
          // expected likely letter (a/b/c...). compare case-insensitive
          matched = (userNorm === expectedNorm);
        }

        if (matched) correct++;
      }

      const totalQuestions = questionIds.length || 1;
      const grade = ((correct / totalQuestions) * 100).toFixed(2); // string like "83.33"

      // patch attempt with grade + status finished + submitted_at
      await finishAttempt(a, grade);

      // refresh attempts and navigate to review for this attempt
      await fetchAttempts();
      navigate(`/review?tryoutId=${a.tryout_id}&attempt=${a.attempt_number}`);
    } catch (err) {
      console.error('Grade attempt failed', err);
      alert('Gagal menyelesaikan attempt. Lihat console untuk detail.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAttempt = (a: Attempt) => {
    navigate(`/review?tryoutId=${a.tryout_id}&attempt=${a.attempt_number}`);
  };

  // Disabled when there's at least one ongoing attempt with remaining > 0
  const startDisabled = attempts.some(a => a.status === 'ongoing' && getRemainingSeconds(a) > 0);

  // display time limit: prefer tryoutData.duration_minutes if present
  const formatMinutesReadable = (mins?: number | null) => {
    if (typeof mins !== 'number' || Number.isNaN(mins) || mins === null) return 'N/A';
    const m = Math.floor(mins);
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      return mm === 0 ? `${h}h (${m} minutes)` : `${h}h ${mm}m (${m} minutes)`;
    }
    return `${m} minutes`;
  };

  const displayTimeLimit = (() => {
    if (typeof tryoutData?.duration_minutes === 'number') {
      return formatMinutesReadable(tryoutData.duration_minutes);
    }
    // fallback try any attempt's duration_minutes
    const anyDur = attempts.find(a => typeof a.duration_minutes === 'number' && a.duration_minutes !== null);
    if (anyDur?.duration_minutes) return formatMinutesReadable(anyDur.duration_minutes);
    return 'N/A';
  })();

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!tryoutData) return <Typography>Tidak ada data tryout</Typography>;

  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{tryoutData.name}</Typography>
      <Typography variant="body2">{tryoutData.description}</Typography>

      <Stack spacing={1}>
        <Typography><strong>Created At:</strong> {tryoutData.created_at}</Typography>
        <Typography><strong>Attempts Allowed:</strong> {tryoutData.attemptsAllowed ?? 3}</Typography>
        <Typography><strong>Time Limit:</strong> {displayTimeLimit}</Typography>
        <Typography><strong>Grading Method:</strong> {tryoutData.gradingMethod ?? 'N/A'}</Typography>
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

      {isMobile ? (
        <Stack spacing={2}>
          {attempts.map((a, idx) => {
            const remainingSec = getRemainingSeconds(a);
            const isActive = a.status === 'ongoing' && remainingSec > 0;
            const isExpiredOngoing = a.status === 'ongoing' && remainingSec <= 0;
            const isFinished = a.status === 'finished' || a.status === 'submitted' || a.status === 'graded';
            return (
              <Paper key={`${a.tryout_id}-${a.attempt_number}`} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Stack spacing={1}>
                  <Typography><strong>Attempt #{idx + 1}</strong></Typography>
                  <Typography>
                    Status: {isFinished ? 'Finished' : isExpiredOngoing ? 'Time expired' : `Ongoing — ${formatHMS(remainingSec)}`}
                  </Typography>
                  <Typography>Grade: {a.grade ?? '-'}</Typography>
                  <Stack direction="row" spacing={1}>
                    {a.status === 'ongoing' ? (
                      isActive ? (
                        <Button size="small" variant="contained" onClick={() => handleContinueAttempt(a)}>Continue</Button>
                      ) : (
                        <Button size="small" variant="contained" color="secondary" onClick={() => void handleGradeAttempt(a)}>Grade</Button>
                      )
                    ) : (
                      <Button size="small" variant="outlined" onClick={() => handleReviewAttempt(a)}>Review</Button>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Status / Time Left</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attempts.map((a, idx) => {
                const remainingSec = getRemainingSeconds(a);
                const isActive = a.status === 'ongoing' && remainingSec > 0;
                const isExpiredOngoing = a.status === 'ongoing' && remainingSec <= 0;
                const isFinished = a.status === 'finished' || a.status === 'submitted' || a.status === 'graded';
                return (
                  <TableRow key={`${a.tryout_id}-${a.attempt_number}`}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      {isFinished ? (
                        <Typography>Finished</Typography>
                      ) : isExpiredOngoing ? (
                        <Typography color="warning.main">Time expired</Typography>
                      ) : (
                        <Typography color="primary">Ongoing — {formatHMS(remainingSec)}</Typography>
                      )}
                    </TableCell>
                    <TableCell>{a.grade ?? '-'}</TableCell>
                    <TableCell>
                      {a.status === 'ongoing' ? (
                        isActive ? (
                          <Button size="small" variant="contained" onClick={() => handleContinueAttempt(a)}>Continue</Button>
                        ) : (
                          <Button size="small" variant="contained" color="secondary" onClick={() => void handleGradeAttempt(a)}>Grade</Button>
                        )
                      ) : (
                        <Button size="small" variant="outlined" onClick={() => handleReviewAttempt(a)}>Review</Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Button variant="contained" onClick={() => void handleStartAttempt()} disabled={startDisabled}>
        Start New Attempt
      </Button>
    </Stack>
  );
}
