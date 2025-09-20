import { useEffect, useState } from 'react';
import {
  Stack,
  Button,
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface QuizNavigationProps {
  totalQuestions: number;
  selectedQuestion: number;
  onSelectQuestion: (numOrder: number) => void;
  answeredQuestions: number[];
  flaggedQuestions: number[];
  onToggleFlag: (numOrder: number) => void;
  showAll: boolean;
  onToggleShowAll: () => void;
  durationMinutes: number;
  startTime: string;
  onTimeUp: () => void;
  onFontSizeChange: (size: 'small' | 'normal' | 'large') => void;
}

export default function QuizNavigation({
  totalQuestions,
  selectedQuestion,
  onSelectQuestion,
  answeredQuestions,
  flaggedQuestions,
  showAll,
  onToggleShowAll,
  durationMinutes,
  startTime,
  onTimeUp,
  onFontSizeChange,
}: QuizNavigationProps) {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(durationMinutes * 60);
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ✅ custom hook untuk windowHeight
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  useEffect(() => {
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // countdown
  useEffect(() => {
    const start = new Date(startTime).getTime();
    const totalSeconds = durationMinutes * 60;

    const tick = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = totalSeconds - elapsed;

      if (remaining <= 0) {
        setTimeLeft(0);
        onTimeUp();
        clearInterval(tick);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [startTime, durationMinutes, onTimeUp]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleFontSize = (size: 'small' | 'normal' | 'large') => {
    setFontSize(size);
    onFontSizeChange(size);
  };

  // ✅ tinggi maksimal grid
  const gridMaxHeight = isMobile ? 260 : windowHeight - 250;

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1976d2',
          px: 1,
          py: 0.5,
          minHeight: 44,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: timeLeft < 60 ? 'error.main' : 'common.white',
            fontWeight: 700,
            letterSpacing: 0.3,
            fontSize: '17px',
          }}
        >
          ⏳ Waktu tersisa : {formatTime(timeLeft)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={expanded ? 'Sembunyikan' : 'Tampilkan'} arrow>
            <IconButton
              size="small"
              aria-label="expand"
              onClick={() => setExpanded((e) => !e)}
              sx={{
                color: 'common.white',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: '0.25s',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
              }}
            >
              <ExpandMoreIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Collapsible content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 1, pb: 1 }}>
          {/* Controls */}
          <Stack
            direction="row"
            spacing={1}
            mb={1}
            alignItems="center"
            justifyContent={'space-between'}
            display={'flex'}
          >
            <Tooltip title={showAll ? 'Fokus ke satu soal' : 'Perlihatkan semua soal'} arrow>
              <Button
                size="small"
                variant="outlined"
                onClick={onToggleShowAll}
                sx={{ flexGrow: 1, minWidth: 'auto' }}
              >
                {showAll ? 'Semua soal' : 'Lihat 1 soal'}
              </Button>
            </Tooltip>

            <Tooltip title={'Ubah ukuran huruf'} arrow>
              <Button
                size="small"
                variant={fontSize === 'small' ? 'contained' : 'outlined'}
                onClick={() => handleFontSize('small')}
                sx={{ flexGrow: 1, minWidth: 'auto', fontSize:'14px'  }}
              >
                A-
              </Button>
            </Tooltip>

            <Tooltip title={'Ubah ukuran huruf'} arrow>
              <Button
                size="small"
                variant={fontSize === 'normal' ? 'contained' : 'outlined'}
                onClick={() => handleFontSize('normal')}
                sx={{ flexGrow: 1, minWidth: 'auto', fontSize:'16px' }}
              >
                A
              </Button>
            </Tooltip>

            <Tooltip title={'Ubah ukuran huruf'} arrow>
              <Button
                size="small"
                variant={fontSize === 'large' ? 'contained' : 'outlined'}
                onClick={() => handleFontSize('large')}
                sx={{ flexGrow: 1, minWidth: 'auto', fontSize:'18px'  }}
              >
                A+
              </Button>
            </Tooltip>
          </Stack>

          {/* Grid nomor soal */}
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(5, 1fr)',
              sm: 'repeat(6, 1fr)',
              md: 'repeat(8, 1fr)',
              lg: 'repeat(10, 1fr)',
            }}
            gap={1}
            sx={{
              maxHeight: gridMaxHeight,
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f0f0f0',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#bbb',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#999' },
              pb: '2px',
              pt: '4px',
            }}
          >
            {Array.from({ length: totalQuestions }, (_, idx) => {
              const numOrder = idx + 1;
              const isSelected = numOrder === selectedQuestion;
              const isAnswered = answeredQuestions.includes(numOrder);
              const flagged = flaggedQuestions.includes(numOrder);

              return (
                <Button
                  key={numOrder}
                  onClick={() => onSelectQuestion(numOrder)}
                  sx={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: 1,
                    backgroundColor: isSelected
                      ? '#1976d2'
                      : isAnswered
                      ? '#2e7d32'
                      : '#ffffff',
                    border: '1px solid #999',
                    color: isSelected || isAnswered ? '#fff' : '#000',
                    fontSize: 13,
                    fontWeight: 500,
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: isSelected
                        ? '#115293'
                        : isAnswered
                        ? '#1b5e20'
                        : '#f0f0f0',
                    },
                    ...(flagged && {
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '20%',
                        backgroundColor: '#d32f2f',
                        borderTopLeftRadius: '4px',
                        borderTopRightRadius: '4px',
                      },
                    }),
                  }}
                >
                  {numOrder}
                </Button>
              );
            })}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}
