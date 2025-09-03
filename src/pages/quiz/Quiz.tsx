// src/pages/Quiz/Quiz.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import QuestionForm from '../../components/beranda/soal';
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
  const attemptNumber = attemptFromState ?? (attemptQuery ? Number(attemptQuery) : null);

  // -------------------- types --------------------
  interface Question {
    id: number;
    text: string;
    options: { id: string; text: string }[];
    answerKey: string;
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
    answer_order: string; // e.g. "-,a,-,b"
    start_time: string;
    submitted_at: string | null;
  }

  // -------------------- state --------------------
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttemptFromServer | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
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
        if (!attemptNumber) throw new Error('Attempt number tidak diberikan. Mulai attempt terlebih dahulu.');

        // 1) fetch questions filtered by tryoutId
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

        // 2) fetch attempt by tryoutId + attemptNumber
        const aRes = await axios.get<QuizAttemptFromServer>(
          `http://localhost:3000/quizattempt/${encodeURIComponent(tryoutId)}/${encodeURIComponent(String(attemptNumber))}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const attemptData = aRes.data as QuizAttemptFromServer | null;

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
          if (attemptData.answer_order) {
            const ansArr = attemptData.answer_order.split(',').map(x => x.trim());
            ansArr.forEach((val, idx) => {
              if (!val || val === '-') return;
              const q = orderedQuestions[idx];
              if (q) answersFromAttempt[q.id] = val;
            });
          }
        } else {
          // fallback: sort by id asc
          orderedQuestions.sort((a, b) => a.id - b.id);
        }

        if (!mounted) return;

        setQuestions(orderedQuestions);
        setAnswers(answersFromAttempt);
        setCurrentAttempt(attemptData ?? null);
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
  }, [tryoutId, attemptNumber]);

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
      // Question not found in the order — this shouldn't happen; log and return
      console.error('Question id not found in currentAttempt.question_order', questionId);
      return;
    }
    ansArr[idx] = answerId;

    // Build new answer_order string
    const updatedAnswerOrder = ansArr.join(',');

    try {
      // PATCH endpoint uses tryoutId + attemptNumber (backend expects this route)
      // if backend expects different route, adapt accordingly.
      const res = await axios.patch(
        `http://localhost:3000/quizattempt/${encodeURIComponent(currentAttempt.tryout_id)}/${encodeURIComponent(String(currentAttempt.attempt_number))}`,
        { answer_order: updatedAnswerOrder },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update attempt state with returned row (if backend returns updated row)
      if (res.status === 200 && res.data) {
        setCurrentAttempt(res.data as QuizAttemptFromServer);
      }
    } catch (err) {
      console.error('Gagal update jawaban:', err);
      // optionally set error state or show toast
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
      // backend finalize route expects attempt.id
      const res = await axios.patch(
        `http://localhost:3000/quizattempt/${encodeURIComponent(currentAttempt.tryout_id)}/${encodeURIComponent(String(currentAttempt.attempt_number))}/finalize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 || res.status === 201) {
        const updatedAttempt = res.data as QuizAttemptFromServer;
        setCurrentAttempt(updatedAttempt);
        alert(`Attempt selesai! Grade kamu: ${updatedAttempt.grade}`);
      } else {
        alert('Finalize attempt gagal.');
      }
    } catch (err) {
      console.error('Gagal finalize attempt:', err);
      alert('Gagal finalisasi attempt');
    }
  };

  // -------------------- other handlers --------------------
  const handleToggleFlag = (questionId: number): void => {
    setFlaggedQuestions(prev => prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]);
  };

  const handleSubmit = useCallback(() => {
    // local calculation (if you want to compute before server finalize)
    const userAnswers = questions.map(q => ({
      questionId: q.id,
      userAnswer: answers[q.id] ?? null,
      correctAnswer: q.answerKey,
      isCorrect: answers[q.id] === q.answerKey,
    }));

    const correctCount = userAnswers.filter(ua => ua.isCorrect).length;
    const score = Math.round((correctCount / (questions.length || 1)) * 100);

    alert(`Kamu menjawab benar ${correctCount} dari ${questions.length} soal.\nSkor kamu: ${score}`);
    // NOTE: Final server-side grading happens in handleFinalizeAttempt()
  }, [answers, questions]);

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

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;
  const durationMinutes = 90;

  // Intersection observer for showAll
  useEffect(() => {
    if (!showAll || questions.length === 0) return;

    let margin = '-50px 0px -60% 0px';
    if (isMobile) margin = '-60px 0px -23% 0px';
    else if (isTablet) margin = '-60px 0px -53% 0px';
    else if (isLaptop) margin = '-60px 0px -40% 0px';
    else if (isLarge) margin = '-60px 0px -60% 0px';

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
                    const idx = questions.findIndex(q => q.id === (activeInViewId ?? questions[0].id));
                    return idx >= 0 ? idx + 1 : 1;
                  })()
                : (() => {
                    const idx = questions.findIndex(q => q.id === selectedQuestionId);
                    return idx >= 0 ? idx + 1 : 1;
                  })()
            }
            onSelectQuestion={handleSelectQuestion}
            answeredQuestions={Object.keys(answers).map(aid => {
              const qid = Number(aid);
              const idx = questions.findIndex(q => q.id === qid);
              return idx + 1;
            })}
            flaggedQuestions={flaggedQuestions.map(fid => {
              const idx = questions.findIndex(q => q.id === fid);
              return idx + 1;
            })}
            onToggleFlag={(idNumOrder: number) => {
              const idx = idNumOrder - 1;
              const q = questions[idx];
              if (q) handleToggleFlag(q.id);
            }}
            showAll={showAll}
            onToggleShowAll={() => setShowAll(prev => !prev)}
            durationMinutes={durationMinutes}
            onTimeUp={handleSubmit}
            onFontSizeChange={(size) => setFontSize(size)}
          />
        </Box>
      )}

      {/* MAIN question area */}
      <Box flex={1} width="100%" sx={{ display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={4} sx={{ width: '100%', flexGrow: 1 }}>
          {showAll ? (
            <>
              {questions.map((q) => (
                <Stack key={q.id} ref={(el) => (questionRefs.current[q.id] = el)} data-qid={q.id}>
                  <QuestionForm
                    questions={[q]}
                    selectedQuestionId={q.id}
                    answers={answers}
                    onAnswerChange={(qid: number, aid: string) => { void handleAnswerChange(qid, aid); }}
                    flaggedQuestions={flaggedQuestions}
                    onToggleFlag={handleToggleFlag}
                    fontSize={fontSize}
                  />
                </Stack>
              ))}
              <Button variant="contained" size="large" color={allAnswered ? 'primary' : 'inherit'} disabled={!allAnswered} onClick={handleSubmit}>
                Submit
              </Button>
            </>
          ) : (
            <QuestionForm
              questions={questions}
              selectedQuestionId={selectedQuestionId ?? undefined}
              answers={answers}
              onAnswerChange={(qid: number, aid: string) => { void handleAnswerChange(qid, aid); }}
              flaggedQuestions={flaggedQuestions}
              onToggleFlag={handleToggleFlag}
              fontSize={fontSize}
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
                    const idx = questions.findIndex(q => q.id === (activeInViewId ?? questions[0].id));
                    return idx >= 0 ? idx + 1 : 1;
                  })()
                : (() => {
                    const idx = questions.findIndex(q => q.id === selectedQuestionId);
                    return idx >= 0 ? idx + 1 : 1;
                  })()
            }
            onSelectQuestion={handleSelectQuestion}
            answeredQuestions={Object.keys(answers).map(aid => {
              const qid = Number(aid);
              const idx = questions.findIndex(q => q.id === qid);
              return idx + 1;
            })}
            flaggedQuestions={flaggedQuestions.map(fid => {
              const idx = questions.findIndex(q => q.id === fid);
              return idx + 1;
            })}
            onToggleFlag={(idNumOrder: number) => {
              const idx = idNumOrder - 1;
              const q = questions[idx];
              if (q) handleToggleFlag(q.id);
            }}
            showAll={showAll}
            onToggleShowAll={() => setShowAll(prev => !prev)}
            durationMinutes={durationMinutes}
            onTimeUp={handleSubmit}
            onFontSizeChange={(size) => setFontSize(size)}
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
