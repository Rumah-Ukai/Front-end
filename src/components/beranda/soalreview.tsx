// src/components/beranda/soalreview.tsx
import React, { useEffect } from 'react';
import {
  Card,
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  CardHeader,
  CardContent,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { InlineMath } from 'react-katex';

interface Option {
  id: string;
  text: string;
}

interface TableCellData {
  value: string;
  colspan?: number;
  rowspan?: number;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  image?: string;
  table?: {
    headers: string | string[];
    rows: string | (string | TableCellData)[][];
  };
  answerKey?: string;
  explanation?: string;
  explanationImage?: string;
  explanationTable?: {
    headers: string | string[];
    rows: string | (string | TableCellData)[][];
  };
}

interface QuestionFormProps {
  questions: Question[];
  selectedQuestionId?: number;
  answers: Record<number, string>;
  fontSize: 'small' | 'normal' | 'large';
  registerQuestionRef?: (id: number, el: HTMLDivElement | null) => void;
  isReview?: boolean;
}

const getFontSize = (size: 'small' | 'normal' | 'large') => {
  switch (size) {
    case 'small':
      return 14;
    case 'normal':
      return 16;
    case 'large':
      return 18;
    default:
      return 16;
  }
};

const parseTable = (
  table?: { headers: string | string[]; rows: string | (string | TableCellData)[][] }
) => {
  if (!table || !table.headers || !table.rows) return undefined;

  const headersArray = Array.isArray(table.headers)
    ? table.headers
    : table.headers.split('|');

  const rowsArray = Array.isArray(table.rows)
    ? table.rows
    : table.rows.split(';').map((rowStr) =>
        rowStr.split('|').map((cellStr) => {
          const [value, colspan] = cellStr.split('^');
          return colspan ? { value, colspan: parseInt(colspan, 10) } : value;
        })
      );

  return { headers: headersArray, rows: rowsArray };
};

const parseTextWithMath = (text: string, keyPrefix = 0) => {
  const parts = text.split(/(\$\$.*?\$\$)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const mathContent = part.slice(2, -2);
      return <InlineMath key={`${keyPrefix}-${idx}`} math={mathContent} />;
    }
    return <span key={`${keyPrefix}-${idx}`}>{part}</span>;
  });
};

const QuestionForm: React.FC<QuestionFormProps> = ({
  questions,
  selectedQuestionId,
  answers,
  fontSize,
  registerQuestionRef,
  isReview = false,
}) => {
  const visibleQuestions = selectedQuestionId
    ? questions.filter((q) => q.id === selectedQuestionId)
    : questions;

  useEffect(() => {
    // Tidak perlu collapse lagi, semua soal akan langsung terbuka
  }, [selectedQuestionId, questions]);

  return (
    <Stack spacing={1} sx={{ width: '100%', height: 'auto' }}>
      {visibleQuestions.map((q) => {
        // nomor soal dihitung dari urutan global di array questions
        const soalNumber = questions.findIndex(x => x.id === q.id) + 1;
        const userAnswer = answers[q.id] || '';
        const isCorrect = q.answerKey && userAnswer === q.answerKey;
        const currentFontSize = getFontSize(fontSize);
        const parsedTable = parseTable(q.table);

        return (
          <div
            key={q.id}
            data-qid={q.id}
            ref={(el) => {
              if (registerQuestionRef) registerQuestionRef(q.id, el);
            }}
          >
            <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 1 }}>
              <CardHeader
                sx={{
                  py: 1,
                  backgroundColor: userAnswer
                    ? isCorrect
                      ? '#2e7d32'
                      : '#d32f2f'
                    : '#1976d2',
                }}
                title={
                  <Typography variant="subtitle1" fontWeight="bold" color="white">
                    Soal {soalNumber}
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2, fontSize: currentFontSize }}>
                  {parseTextWithMath(q.text)}
                </Typography>

                {q.image && (
                  <Box
                    sx={{
                      width: {
                        xs: '100%',
                        sm: '100%',
                        md: '400px',
                        lg: '450px',
                        xl: '500px',
                      },
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    <img
                      src={q.image}
                      alt={`Soal ${soalNumber}`}
                      style={{ maxWidth: '100%', borderRadius: 8 }}
                    />
                  </Box>
                )}

                {parsedTable && (
                  <Box sx={{ mb: 2, overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {parsedTable.headers.map((header, idx2) => (
                            <TableCell key={idx2} sx={{ fontWeight: 'bold' }}>
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {parsedTable.rows.map((row, rIdx) => (
                          <TableRow key={rIdx}>
                            {row.map((cell, cIdx) =>
                              typeof cell === 'string' ? (
                                <TableCell key={cIdx}>{cell}</TableCell>
                              ) : (
                                <TableCell
                                  key={cIdx}
                                  colSpan={cell.colspan || 1}
                                  sx={{ textAlign: 'center' }}
                                >
                                  {cell.value}
                                </TableCell>
                              )
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Pilihan jawaban */}
                <RadioGroup value={userAnswer}>
                  {q.options.map((opt) => (
                    <FormControlLabel
                      key={opt.id}
                      value={opt.id}
                      disabled={isReview}
                      control={<Radio disabled={isReview} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: currentFontSize }}>
                            {parseTextWithMath(opt.text)}
                          </Typography>
                          {q.answerKey === opt.id && (
                            <CheckIcon color="success" sx={{ ml: 1 }} />
                          )}
                          {userAnswer &&
                            userAnswer !== q.answerKey &&
                            userAnswer === opt.id && (
                              <ClearIcon color="error" sx={{ ml: 1 }} />
                            )}
                        </Box>
                      }
                      sx={isReview ? { cursor: 'default', pointerEvents: 'none' } : {}}
                    />
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </Stack>
  );
};

export default QuestionForm;
