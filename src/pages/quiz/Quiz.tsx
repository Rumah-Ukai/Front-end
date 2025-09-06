// src/pages/Quiz/Quiz.tsx
import { useState, useEffect, useRef } from 'react';
import {
  Stack,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import QuestionForm, { Question as QCompQuestion } from '../../components/beranda/soal';
import QuizNavigation from '../../components/beranda/soalnav';

export default function Quiz(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLaptop = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));

  const location = useLocation();
  const [searchParams] = useSearchParams();

  // state mungkin dikirim dari Tryout atau via query string
  const state = (location.state || {}) as { tryoutId?: string; attempt?: number };
  const tryoutIdFromState = state.tryoutId ?? null;
  const attemptFromState = state.attempt ?? null;

  const tryoutIdQuery = searchParams.get('tryoutId');
  const attemptQuery = searchParams.get('attempt');

  const tryoutId = tryoutIdFromState ?? tryoutIdQuery;

  // attemptNumber sekarang dikelola sebagai state agar kita bisa start attempt jika tidak ada
  const initialAttempt = attemptFromState ?? (attemptQuery ? Number(attemptQuery) : null);
  const [attemptNumberState, setAttemptNumberState] = useState<number | null>(initialAttempt);

  // -------------------- types --------------------
  interface Question {
    id: number;
    text: string;
    options: { id: string; text: string }[];
    answerKey?: string;
    explanation?: string;
    image?: string;
    table?: {
      headers: string[];
      rows: string[][];
    };
  }

  interface ServerQuestion {
    id: number;
    question_text: string;
    option_a: string | null;
    option_b: string | null;
    option_c: string | null;
    option_d: string | null;
    option_e: string | null;
    answer_key: string;
    explanation: string;
    image_url?: string | null;
    table_headers?: string[] | string | null;
    table_rows?: string[][] | string | null;
  }

  interface QuizAttemptFromServer {
    id: number;
    user_id: number;
    tryout_id: string;
    attempt_number: number;
    grade: string | null;
    status: string;
    question_order: string; // e.g. "5,2,1,3"
    answer_order: string; // e.g. "-,a,-,b" (may include 'f' markers)

    submitted_at: string | null;
    start_time: string | null;
    duration_minutes: number;
  }

  // -------------------- state --------------------
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttemptFromServer | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // pure answers only (no 'f')
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]); // question IDs
  const [showAll, setShowAll] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [activeInViewId, setActiveInViewId] = useState<number | null>(null);

  // -------------------- helpers --------------------
  const parseHeaders = (headers?: string[] | string | null): string[] | undefined => {
    if (!headers) return undefined;
    if (Array.isArray(headers)) return headers;
    return headers.split('|').map(h => h.trim());
  };

  const parseRows = (rows?: string[][] | string | null): string[][] | undefined => {
    if (!rows) return undefined;
    if (Array.isArray(rows)) return rows as string[][];
    return rows
      .split(';')
      .map(r => r.split('|').map(c => c.trim()))
      .filter(r => r.length > 0);
  };

  // parse attempt.answer_order -> { answersMap (cleaned), flaggedIds }
  const parseAttemptAnswersAndFlags = (attempt: QuizAttemptFromServer | null) => {
    if (!attempt) return { answersMap: {} as Record<number, string>, flaggedIds: [] as number[] };

    const qOrder = (attempt.question_order || '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => Number(s));

    const ansArr = (attempt.answer_order || '').split(',');
    // ensure same length
    while (ansArr.length < qOrder.length) ansArr.push('-');

    const answersMap: Record<number, string> = {};
    const flaggedIds: number[] = [];

    qOrder.forEach((qid, idx) => {
      const token = (ansArr[idx] ?? '').trim();
      if (token.includes('f')) flaggedIds.push(qid);

      // cleaned answer: remove 'f' markers
      const cleaned = token.replace(/f/g, '').trim();

      // only treat as answered if cleaned contains an option letter (a-e)
      if (/^[a-eA-E]$/.test(cleaned)) {
        answersMap[qid] = cleaned.toLowerCase();
      }
    });

    return { answersMap, flaggedIds };
  };

  // -------------------- load questions + attempt --------------------
  useEffect(() => {
    let mounted = true;

    const load = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

        if (!tryoutId) throw new Error('tryoutId tidak diberikan (query string atau state).');

        // 1) fetch questions filtered by tryoutId (this endpoint reads tryout_questions internally)
        const qRes = await axios.get<ServerQuestion[]>(
          `http://localhost:3000/questions?tryoutId=${encodeURIComponent(tryoutId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!mounted) return;

        const serverQuestions = Array.isArray(qRes.data) ? qRes.data : [];
        const mapped: Question[] = serverQuestions.map((q) => ({
          id: q.id,
          text: q.question_text,
          options: [
            { id: 'a', text: q.option_a ?? '' },
            { id: 'b', text: q.option_b ?? '' },
            { id: 'c', text: q.option_c ?? '' },
            { id: 'd', text: q.option_d ?? '' },
            { id: 'e', text: q.option_e ?? '' },
          ].filter(opt => opt.text !== ''),
          answerKey: q.answer_key,
          explanation: q.explanation,
          image: q.image_url || undefined,
          table: (() => {
            const headersParsed = parseHeaders(q.table_headers);
            const rowsParsed = parseRows(q.table_rows);
            return headersParsed && rowsParsed ? { headers: headersParsed, rows: rowsParsed } : undefined;
          })(),
        }));

        // 2) fetch or create attempt by tryoutId + attemptNumberState
        let attemptData: QuizAttemptFromServer | null = null;

        if (!attemptNumberState) {
          // start a new attempt if not provided
          const startRes = await axios.post(
            `http://localhost:3000/quizattempt/start`,
            { tryout_id: tryoutId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          attemptData = startRes.data as QuizAttemptFromServer;
          if (!mounted) return;
          setCurrentAttempt(attemptData);
          setAttemptNumberState(attemptData.attempt_number);
        } else {
          // fetch existing attempt
          const aRes = await axios.get<QuizAttemptFromServer>(
            `http://localhost:3000/quizattempt/${encodeURIComponent(tryoutId)}/${encodeURIComponent(String(attemptNumberState))}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          attemptData = aRes.data as QuizAttemptFromServer;
          if (!mounted) return;
          setCurrentAttempt(attemptData);
        }

        // 3) compute orderedQuestions and initial answers
        let orderedQuestions: Question[] = mapped.slice();
        const answersFromAttempt: Record<number, string> = {};

        if (attemptData && attemptData.question_order) {
          // parse question_order (ids)
          const qOrder = attemptData.question_order
            .split(',')
            .map(s => s.trim())
            .filter(s => s !== '')
            .map(s => Number(s));

          const qMap = new Map<number, Question>();
          mapped.forEach(mq => qMap.set(mq.id, mq));

          // keep only questions that exist in the map (safety)
          orderedQuestions = qOrder.map(id => qMap.get(id)).filter(Boolean) as Question[];

          // parse answer_order aligned with orderedQuestions positions
          const { answersMap, flaggedIds } = parseAttemptAnswersAndFlags(attemptData);

          Object.assign(answersFromAttempt, answersMap);

          // set flagged questions into parent state (single source of truth)
          if (mounted) setFlaggedQuestions(flaggedIds);
        } else {
          // fallback: sort by id asc
          orderedQuestions.sort((a, b) => a.id - b.id);
        }

        if (!mounted) return;

        setQuestions(orderedQuestions);
        setAnswers(answersFromAttempt); // NOTE: answersFromAttempt has CLEANED answers (no 'f')
        setSelectedQuestionId(orderedQuestions.length > 0 ? orderedQuestions[0].id : null);
        setLoading(false);
      } catch (err) {
        console.error('Load quiz error:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat quiz');
        setLoading(false);
      }
    };

    void load();

    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tryoutId, attemptNumberState]);

  // -------------------- handle answer change (sync to backend) --------------------
  const handleAnswerChange = async (questionId: number, answerId: string): Promise<void> => {
    // update local immediately for snappy UI
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));

    if (!currentAttempt) {
      console.warn('No currentAttempt found. Answer will not be synced to backend.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found. Cannot sync answer.');
      return;
    }

    // Build qOrder (numbers) from currentAttempt.question_order
    const qOrder = currentAttempt.question_order
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => Number(s));

    // Build ansArr from currentAttempt.answer_order (or placeholder)
    const ansArr = currentAttempt.answer_order && currentAttempt.answer_order.trim() !== ''
      ? currentAttempt.answer_order.split(',').map(s => s.trim())
      : qOrder.map(() => '-');

    // Find position for this questionId in qOrder, and set answer
    const idx = qOrder.findIndex(qid => qid === questionId);
    if (idx === -1) {
      console.error('Question id not found in currentAttempt.question_order', questionId);
      return;
    }

    // preserve flag if present: if ansArr[idx] contains 'f', keep it
    const hasFlag = ansArr[idx]?.includes('f') ?? false;
    ansArr[idx] = (answerId || '-').toString() + (hasFlag ? 'f' : '');

    // Build new answer_order string
    const updatedAnswerOrder = ansArr.join(',');

    try {
      const res = await axios.patch(
        `http://localhost:3000/quizattempt/${encodeURIComponent(currentAttempt.tryout_id)}/${encodeURIComponent(String(currentAttempt.attempt_number))}`,
        { answer_order: updatedAnswerOrder },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update attempt state with returned row (if backend returns updated row)
      if (res.status === 200 && res.data) {
        const srv = res.data as QuizAttemptFromServer;
        setCurrentAttempt(srv);

        // reparse answers & flags from server response to ensure sync
        const { answersMap, flaggedIds } = parseAttemptAnswersAndFlags(srv);
        setAnswers(answersMap);
        setFlaggedQuestions(flaggedIds);
      }
    } catch (err) {
      console.error('Gagal update jawaban:', err);
      // optionally set error state or show toast
    }
  };

  // -------------------- toggle flag (centralized + sync) --------------------
  const handleToggleFlag = async (questionId: number): Promise<void> => {
    const willBeFlagged = !flaggedQuestions.includes(questionId);

    // optimistic UI update
    setFlaggedQuestions(prev => (willBeFlagged ? Array.from(new Set([...prev, questionId])) : prev.filter(id => id !== questionId)));

    // optimistic update of currentAttempt.answer_order and keep answers state unchanged (answers store only letters)
    let optimisticAnsArr: string[] | null = null;
    if (currentAttempt) {
      const qOrder = currentAttempt.question_order.split(',').map(s => Number(s));
      const ansArr = (currentAttempt.answer_order || '').split(',');
      while (ansArr.length < qOrder.length) ansArr.push('-');

      const idx = qOrder.indexOf(questionId);
      if (idx !== -1) {
        const currentAns = ansArr[idx] || '-';
        // remove old f markers
        const cleaned = currentAns.replace(/f/g, '');
        // if willBeFlagged -> append 'f', otherwise keep cleaned only
        ansArr[idx] = (cleaned === '-' ? '' : cleaned) + (willBeFlagged ? 'f' : '');
      }
      optimisticAnsArr = ansArr;
      setCurrentAttempt(prev => prev ? { ...prev, answer_order: ansArr.join(',') } : prev);
    }

    // sync to backend
    try {
      const token = localStorage.getItem('token');
      if (!token || !currentAttempt) {
        // update UI only if no token or attempt (rare)
        return;
      }

      const patchBody = { answer_order: optimisticAnsArr ? optimisticAnsArr.join(',') : currentAttempt.answer_order };
      const res = await axios.patch(
        `http://localhost:3000/quizattempt/${encodeURIComponent(currentAttempt.tryout_id)}/${encodeURIComponent(String(currentAttempt.attempt_number))}`,
        patchBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 && res.data) {
        const srv = res.data as QuizAttemptFromServer;
        setCurrentAttempt(srv);

        // parse server's authoritative data and update answers & flags
        const { answersMap, flaggedIds } = parseAttemptAnswersAndFlags(srv);
        setAnswers(answersMap);
        setFlaggedQuestions(flaggedIds);
      } else {
        // fallback: re-fetch attempt to be safe
        const aRes = await axios.get<QuizAttemptFromServer>(
          `http://localhost:3000/quizattempt/${encodeURIComponent(currentAttempt.tryout_id)}/${encodeURIComponent(String(currentAttempt.attempt_number))}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const srv = aRes.data;
        setCurrentAttempt(srv);
        const { answersMap, flaggedIds } = parseAttemptAnswersAndFlags(srv);
        setAnswers(answersMap);
        setFlaggedQuestions(flaggedIds);
      }
    } catch (err) {
      console.error('Gagal sync flag ke backend:', err);
      // rollback optimistic UI if sync fails
      setFlaggedQuestions(prev => (willBeFlagged ? prev.filter(id => id !== questionId) : Array.from(new Set([...prev, questionId]))));
      // re-fetch to resync
      try {
        const token = localStorage.getItem('token');
        if (token && currentAttempt) {
          const aRes = await axios.get<QuizAttemptFromServer>(
            `http://localhost:3000/quizattempt/${encodeURIComponent(currentAttempt.tryout_id)}/${encodeURIComponent(String(currentAttempt.attempt_number))}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const srv = aRes.data;
          setCurrentAttempt(srv);
          const { answersMap, flaggedIds } = parseAttemptAnswersAndFlags(srv);
          setAnswers(answersMap);
          setFlaggedQuestions(flaggedIds);
        }
      } catch (err2) {
        console.error('Rollback fetch attempt gagal', err2);
      }
    }
  };

  // -------------------- finalize attempt --------------------
  const handleFinalizeAttempt = async (): Promise<void> => {
    if (!currentAttempt) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    try {
      // compute grade locally (two-decimal string like "83.33")
      const total = questions.length || 1;
      const correctCount = questions.reduce((acc, q) => {
        const ua = (answers[q.id] || '').toLowerCase();
        return acc + (q.answerKey && ua === q.answerKey ? 1 : 0);
      }, 0);
      const percent = (correctCount / total) * 100;
      const gradeStr = percent.toFixed(2); // e.g. "83.33"

      // Use the generic PATCH endpoint (no '/finalize' suffix) — server accepts grade/status/submitted_at via this route
      const body = {
        status: 'finished',
        submitted_at: new Date().toISOString(),
        grade: gradeStr,
      };

      const res = await axios.patch(
        `http://localhost:3000/quizattempt/${encodeURIComponent(currentAttempt.tryout_id)}/${encodeURIComponent(String(currentAttempt.attempt_number))}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 && res.data) {
        const updatedAttempt = res.data as QuizAttemptFromServer;
        setCurrentAttempt(updatedAttempt);
        alert(`Attempt selesai! Grade kamu: ${updatedAttempt.grade ?? gradeStr}`);
      } else {
        // fallback behavior: show computed grade even if server didn't return it
        alert(`Attempt selesai! Grade kamu: ${gradeStr}`);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Gagal finalize attempt:', err);
      // better error message for 404 specifically
      if (err?.response?.status === 404) {
        alert('Finalize gagal: endpoint tidak ditemukan (404). Silakan periksa server.');
      } else {
        alert('Gagal finalisasi attempt');
      }
    }
  };


  const goToPreviousQuestion = (): void => {
    if (selectedQuestionId === null) return;
    const idx = questions.findIndex(q => q.id === selectedQuestionId);
    if (idx > 0) setSelectedQuestionId(questions[idx - 1].id);
  };

  const goToNextQuestion = (): void => {
    if (selectedQuestionId === null) return;
    const idx = questions.findIndex(q => q.id === selectedQuestionId);
    if (idx !== -1 && idx < questions.length - 1) {
      setSelectedQuestionId(questions[idx + 1].id);
    }
  };

  // new: check allAnswered by ensuring each question has a valid answer letter (a-e)
  const allAnswered = questions.length > 0 && questions.every(q => /^[a-e]$/.test((answers[q.id] ?? '').toLowerCase()));

  // Intersection observer for showAll
  useEffect(() => {
    if (!showAll || questions.length === 0) return;

     let margin = '-50px 0px -40% 0px';
    if (isMobile) margin = '-60px 0px -23% 0px';
    else if (isTablet) margin = '-60px 0px -43% 0px';
    else if (isLarge) margin = '-60px 0px -30% 0px';

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target) {
        const idAttr = (visible.target as HTMLElement).getAttribute('data-qid');
        const qid = idAttr ? Number(idAttr) : NaN;
        if (!Number.isNaN(qid)) setActiveInViewId(qid);
      }
    }, { root: null, threshold: 0.5, rootMargin: margin });

    questions.forEach(q => {
      const el = questionRefs.current[q.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showAll, questions, isMobile, isTablet, isLaptop, isLarge]);

  const handleSelectQuestion = (ordinal: number): void => {
    const idx = ordinal - 1;
    const q = questions[idx];
    if (!q) return;
    if (showAll) {
      const target = questionRefs.current[q.id];
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setSelectedQuestionId(q.id);
    }
  };

  // --------------- render states ---------------
  if (loading) {
    return (
      <Stack justifyContent="center" alignItems="center" sx={{ height: '60vh' }}>
        <Typography>Loading soal...</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack justifyContent="center" alignItems="center" sx={{ height: '60vh' }}>
        <Typography color="error">{error}</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      spacing={4}
      sx={{
        paddingX: '20px',
        mx: 'auto',
        mt: 4,
        pr: {
          xs: '20px',
          sm: '360px',
          md: '440px',
          lg: '520px',
          xl: '540px',
        },
      }}
      alignItems="stretch"
    >
      {/* NAV for mobile */}
      {isMobile && (
        <Box sx={{ mb: 2, position: 'sticky', top: 70, zIndex: 10 }}>
          <QuizNavigation
            totalQuestions={questions.length}
            selectedQuestion={
              showAll
                ? (() => {
                    if (!questions.length) return 1;
                    const idx = questions.findIndex(
                      q => q.id === (activeInViewId ?? questions[0].id)
                    );
                    return idx >= 0 ? idx + 1 : 1;
                  })()
                : (() => {
                    const idx = questions.findIndex(q => q.id === selectedQuestionId);
                    return idx >= 0 ? idx + 1 : 1;
                  })()
            }
            onSelectQuestion={handleSelectQuestion}
            answeredQuestions={questions
              .map((q, idx) => (answers[q.id] ? idx + 1 : -1))
              .filter(n => n !== -1)}
            flaggedQuestions={flaggedQuestions.map(fid => {
              const idx = questions.findIndex(q => q.id === fid);
              return idx + 1;
            })}
            onToggleFlag={(idNumOrder: number) => {
              const idx = idNumOrder - 1;
              const q = questions[idx];
              if (q) void handleToggleFlag(q.id);
            }}
            showAll={showAll}
            onToggleShowAll={() => setShowAll(prev => !prev)}
            onTimeUp={handleFinalizeAttempt}
            onFontSizeChange={(size) => setFontSize(size)}
            startTime={currentAttempt?.start_time ?? ''}
            durationMinutes={currentAttempt?.duration_minutes ?? 0}
          />
        </Box>
      )}

      {/* MAIN question area */}
      <Box flex={1} width="100%" sx={{ display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={4} sx={{ width: '100%', flexGrow: 1 }}>
          {showAll ? (
            <>
              {/* single form with all questions; register refs */}
              <QuestionForm
                questions={questions as QCompQuestion[]}
                answers={answers}
                onAnswerChange={(qid: number, aid: string) => { void handleAnswerChange(qid, aid); }}
                flaggedQuestions={flaggedQuestions}
                onToggleFlag={(qid: number) => { void handleToggleFlag(qid); }}
                fontSize={fontSize}
                currentAttemptId={{
                  tryoutId: tryoutId ?? '',
                  attemptNumber: attemptNumberState ?? 0,
                }}
                registerQuestionRef={(id: number, el: HTMLDivElement | null) => {
                  questionRefs.current[id] = el;
                }}
              />

              <Button variant="contained" size="large" color={allAnswered ? 'primary' : 'inherit'} disabled={!allAnswered} onClick={handleFinalizeAttempt}>
                Submit
              </Button>
            </>
          ) : (
            <QuestionForm
              questions={questions as QCompQuestion[]}
              selectedQuestionId={selectedQuestionId ?? undefined}
              answers={answers}
              onAnswerChange={(qid: number, aid: string) => { void handleAnswerChange(qid, aid); }}
              flaggedQuestions={flaggedQuestions}
              onToggleFlag={(qid: number) => { void handleToggleFlag(qid); }}
              fontSize={fontSize}
              currentAttemptId={{
                tryoutId: tryoutId ?? '',
                attemptNumber: attemptNumberState ?? 0,
              }}
            />
          )}

          {!showAll && isMobile && (
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={goToPreviousQuestion} disabled={questions.findIndex(q => q.id === selectedQuestionId) <= 0}>
                Kiri
              </Button>
              <Button variant="contained" size="large" color={allAnswered ? 'primary' : 'inherit'} disabled={!allAnswered} onClick={handleFinalizeAttempt}>
                Submit
              </Button>
              <Button variant="outlined" onClick={goToNextQuestion} disabled={(() => { const idx = questions.findIndex(q => q.id === selectedQuestionId); return idx === -1 || idx === questions.length - 1; })()}>
                Kanan
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* RIGHT NAV for desktop */}
      {!isMobile && (
        <Box sx={{ width: { xs: '100%', sm: 320, md: 400, lg: 480, xl: 520 }, position: 'fixed', right: 20, top: { sm: '120px', md: '145px' }, height: 'auto', flexShrink: 0 }}>
          <QuizNavigation
            totalQuestions={questions.length}
            selectedQuestion={
              showAll
                ? (() => {
                    if (!questions.length) return 1;
                    const idx = questions.findIndex(
                      q => q.id === (activeInViewId ?? questions[0].id)
                    );
                    return idx >= 0 ? idx + 1 : 1;
                  })()
                : (() => {
                    const idx = questions.findIndex(q => q.id === selectedQuestionId);
                    return idx >= 0 ? idx + 1 : 1;
                  })()
            }
            onSelectQuestion={handleSelectQuestion}
            answeredQuestions={questions
              .map((q, idx) => (answers[q.id] ? idx + 1 : -1))
              .filter(n => n !== -1)}
            flaggedQuestions={flaggedQuestions.map(fid => {
              const idx = questions.findIndex(q => q.id === fid);
              return idx + 1;
            })}
            onToggleFlag={(idNumOrder: number) => {
              const idx = idNumOrder - 1;
              const q = questions[idx];
              if (q) void handleToggleFlag(q.id);
            }}
            showAll={showAll}
            onToggleShowAll={() => setShowAll(prev => !prev)}
            onTimeUp={handleFinalizeAttempt}
            onFontSizeChange={(size) => setFontSize(size)}
            startTime={currentAttempt?.start_time ?? ''}
            durationMinutes={currentAttempt?.duration_minutes ?? 0}
          />

          {!showAll && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={goToPreviousQuestion} disabled={questions.findIndex(q => q.id === selectedQuestionId) <= 0}>
                Kiri
              </Button>
              <Button variant="contained" size="large" color={allAnswered ? 'primary' : 'inherit'} disabled={!allAnswered} onClick={handleFinalizeAttempt}>
                Submit
              </Button>
              <Button variant="outlined" onClick={goToNextQuestion} disabled={(() => { const idx = questions.findIndex(q => q.id === selectedQuestionId); return idx === -1 || idx === questions.length - 1; })()}>
                Kanan
              </Button>
            </Stack>
          )}
        </Box>
      )}
    </Stack>
  );
}
