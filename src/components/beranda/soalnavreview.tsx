// src/components/beranda/QuizNavigation.tsx
import  { useState } from 'react';
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
  selectedQuestion: number; // nomor urut 1..N
  onSelectQuestion: (numOrder: number) => void;
  showAll: boolean;
  onToggleShowAll: () => void;
  onFontSizeChange: (size: 'small' | 'normal' | 'large') => void;

  // Review mode selalu aktif
  grade: string | null;
  correctQuestions?: number[];
  incorrectQuestions?: number[];
}

export default function QuizNavigation({
  totalQuestions,
  selectedQuestion,
  onSelectQuestion,
  showAll,
  onToggleShowAll,
  onFontSizeChange,
  grade,
  correctQuestions = [],
  incorrectQuestions = [],
}: QuizNavigationProps) {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');

  const handleFontSize = (size: 'small' | 'normal' | 'large') => {
    setFontSize(size);
    onFontSizeChange(size);
  };

  // pewarnaan nomor soal
  const getButtonColorsForNum = (numOrder: number) => {
    if (correctQuestions.includes(numOrder)) {
      return { bg: '#2e7d32', hover: '#1b5e20', text: '#fff' }; // green
    }
    if (incorrectQuestions.includes(numOrder)) {
      return { bg: '#d32f2f', hover: '#9a0007', text: '#fff' }; // red
    }
    return { bg: '#1976d2', hover: '#115293', text: '#fff' }; // default blue
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
            color: 'common.white',
            fontWeight: 700,
            letterSpacing: 0.3,
          }}
        >
          {grade !== null ? `Score: ${grade}` : 'Score: -'}
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
          {/* Tombol kontrol */}
          <Stack
            direction="row"
            spacing={1}
            mb={1}
            alignItems="center"
            justifyContent={'space-between'}
            display={'flex'}
          >
            <Tooltip title={showAll ? 'Lihat satu soal' : 'Lihat semua soal'} arrow>
              <Button
                size="small"
                variant="outlined"
                onClick={onToggleShowAll}
                sx={{ flexGrow: 1, minWidth: 'auto' }}
              >
                {showAll ? '1+' : '1'}
              </Button>
            </Tooltip>

            <Tooltip title={'Ubah ukuran huruf'} arrow>
              <Button
                size="small"
                variant={fontSize === 'small' ? 'contained' : 'outlined'}
                onClick={() => handleFontSize('small')}
                sx={{ flexGrow: 1, minWidth: 'auto' }}
              >
                A-
              </Button>
            </Tooltip>

            <Tooltip title={'Ubah ukuran huruf'} arrow>
              <Button
                size="small"
                variant={fontSize === 'normal' ? 'contained' : 'outlined'}
                onClick={() => handleFontSize('normal')}
                sx={{ flexGrow: 1, minWidth: 'auto' }}
              >
                A
              </Button>
            </Tooltip>

            <Tooltip title={'Ubah ukuran huruf'} arrow>
              <Button
                size="small"
                variant={fontSize === 'large' ? 'contained' : 'outlined'}
                onClick={() => handleFontSize('large')}
                sx={{ flexGrow: 1, minWidth: 'auto' }}
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
              const numOrder = idx + 1;
              const isSelected = numOrder === selectedQuestion;
              const colors = getButtonColorsForNum(numOrder);

              return (
                <Button
                  key={numOrder}
                  onClick={() => onSelectQuestion(numOrder)}
                  sx={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: 1,
                    backgroundColor: isSelected
                      ? '#0d47a1'
                      : colors.bg,
                    border: '1px solid #999',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: isSelected
                        ? '#08306b'
                        : colors.hover,
                    },
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
