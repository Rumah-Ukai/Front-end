import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface QuizNavigationProps {
  totalQuestions: number;
  selectedQuestion: number; // nomor urut 1..N (bukan id database)
  onSelectQuestion: (numOrder: number) => void; // terima nomor urut 1..N
  answeredQuestions: number[]; // daftar nomor urut yang sudah dijawab
  flaggedQuestions: number[]; // daftar nomor urut yang di-flag
  onToggleFlag: (numOrder: number) => void; // toggle flag by nomor urut
  showAll: boolean;
  onToggleShowAll: () => void;
  durationMinutes: number;
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
  onTimeUp,
  onFontSizeChange,
}: QuizNavigationProps) {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(durationMinutes * 60);
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal'); 

  // countdown (one interval, safe update)
  useEffect(() => {
    const tick = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          clearInterval(tick);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [onTimeUp]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // handle change font size
  const handleFontSize = (size: 'small' | 'normal' | 'large') => {
    setFontSize(size);
    onFontSizeChange(size);
  };

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
            fontWeight: 600,
            letterSpacing: 0.3,
          }}
        >
          ⏳ {formatTime(timeLeft)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Expand / collapse */}
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
              <ExtendIconAdapter />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Collapsible content */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 1, pb: 1 }}>
          {/* Tombol Tunjukan Semua + tombol font control */}
          <Stack direction="row" spacing={1} mb={1} alignItems="center" justifyContent={'space-between'} display={'flex'}>
            <Tooltip title={showAll ? 'Lihat satu soal' : 'Lihat semua soal'} arrow>
              <Button size="small" variant="outlined" onClick={onToggleShowAll} sx={{ flexGrow: 1, minWidth:'auto' }}>
                {showAll ? '1+' : '1'}
              </Button>
            </Tooltip>

            <Tooltip title={'Ubah ukuran huruf'} arrow>
              <Button
                size="small"
                variant={fontSize === 'small' ? 'contained' : 'outlined'}
                onClick={() => handleFontSize('small')}
                sx={{ flexGrow: 1, minWidth:'auto' }}
              >
                A-
              </Button>
            </Tooltip>

            <Tooltip title={'Ubah ukuran huruf'} arrow>
              <Button
                size="small"
                variant={fontSize === 'normal' ? 'contained' : 'outlined'}
                onClick={() => handleFontSize('normal')}
                sx={{ flexGrow: 1, minWidth:'auto' }}
              >
                A
              </Button>
            </Tooltip>

            <Tooltip title={'Ubah ukuran huruf'} arrow>
              <Button
                size="small"
                variant={fontSize === 'large' ? 'contained' : 'outlined'}
                onClick={() => handleFontSize('large')}
                sx={{ flexGrow: 1, minWidth:'auto' }}
              >
                A+
              </Button>
            </Tooltip>
          </Stack>

          {/* Grid nomor soal */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(5, 1fr)', md: 'repeat(8, 1fr)',  sm: 'repeat(6, 1fr)', lg: 'repeat(10, 1fr)'  }} // ✅ responsive
            gap={1}
            sx={{
              maxHeight: 260,
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
              const numOrder = idx + 1; // nomor urut di layar
              const isSelected = numOrder === selectedQuestion; // ✅ highlight by nomor urut
              const isAnswered = answeredQuestions.includes(numOrder);
              const flagged = flaggedQuestions.includes(numOrder);

              return (
                <Button
                  key={numOrder}
                  onClick={() => onSelectQuestion(numOrder)}
                  sx={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: 1, // kotak
                    backgroundColor: isSelected
                      ? '#1976d2' // biru prioritas saat selected
                      : isAnswered
                      ? '#2e7d32' // hijau sudah dijawab
                      : '#ffffff', // putih default
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
                    // strip merah flag di atas
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

function ExtendIconAdapter() {
  return <ExpandMoreIcon sx={{ fontSize: 20 }} />;
}
