// src/components/beranda/soal.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  CardHeader,
  CardContent,
  IconButton,
  Collapse,
  Tooltip,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
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
}

interface QuestionFormProps {
  questions: Question[];
  selectedQuestionId?: number;
  answers: Record<number, string>;
  onAnswerChange: (questionId: number, answerId: string) => void;
  flaggedQuestions: number[]; // list question IDs yang di-flag oleh parent (single source of truth)
  onToggleFlag: (id: number) => void; // toggle flag di parent (expects questionId)
  fontSize: 'small' | 'normal' | 'large';
  currentAttemptId?: { tryoutId: string; attemptNumber: number }; // optional, tidak digunakan di child
  // new: allow parent to register per-question refs (for intersection observer)
  registerQuestionRef?: (id: number, el: HTMLDivElement | null) => void;
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

const parseTable = (table?: { headers: string | string[]; rows: string | (string | TableCellData)[][] }) => {
  if (!table || !table.headers || !table.rows) return undefined;

  const headersArray = Array.isArray(table.headers) ? table.headers : table.headers.split('|');

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

const parseTextWithMath = (text: string) => {
  const parts = text.split(/(\$\$.*?\$\$)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const mathContent = part.slice(2, -2);
      return <InlineMath key={idx} math={mathContent} />;
    }
    return <span key={idx}>{part}</span>;
  });
};

const QuestionForm: React.FC<QuestionFormProps> = ({
  questions,
  selectedQuestionId,
  answers,
  onAnswerChange,
  flaggedQuestions,
  onToggleFlag,
  fontSize,
  registerQuestionRef,
}) => {
  // If selectedQuestionId provided → show only that; otherwise show all questions
  const visibleQuestions = selectedQuestionId ? questions.filter((q) => q.id === selectedQuestionId) : questions;
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (selectedQuestionId) {
      setExpanded((prev) => ({ ...prev, [selectedQuestionId]: true }));
    } else {
      setExpanded(Object.fromEntries(questions.map((q) => [q.id, true])));
    }
  }, [selectedQuestionId, questions]);

  return (
    <Stack spacing={1} sx={{ width: '100%', height: '100%' }}>
      {visibleQuestions.map((q, idx) => {
        const soalNumber = idx + 1;
        const isFlagged = flaggedQuestions.includes(q.id);
        const currentFontSize = getFontSize(fontSize);
        const parsedTable = parseTable(q.table);

        const handleFlagClick = () => {
          // debug log — boleh hapus
          // console.log('Flag click:', { questionId: q.id, wasFlagged: isFlagged, flaggedQuestions });
          onToggleFlag(q.id);
        };

        // wrap each question card in a div that parent can register as ref
        return (
          <div
            key={q.id}
            data-qid={q.id}
            ref={(el) => {
              if (registerQuestionRef) registerQuestionRef(q.id, el);
            }}
          >
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: 'background.paper',
                mb: 1,
              }}
            >
              <CardHeader
                sx={{ backgroundColor: '#1976d2', py: 1 }}
                title={
                  <Typography variant="subtitle1" fontWeight="bold" color="white">
                    Soal {soalNumber}
                  </Typography>
                }
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Tooltip title={isFlagged ? 'Unflag soal ini' : 'Flag soal ini'} arrow>
                      <IconButton
                        size="small"
                        onClick={handleFlagClick}
                        sx={{
                          color: isFlagged ? 'error.main' : 'rgba(255,255,255,0.9)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                        }}
                      >
                        <FlagIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />

              <Collapse in={expanded[q.id]} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 2, fontSize: currentFontSize }}>
                    {parseTextWithMath(q.text)}
                  </Typography>

                  {q.image && (
                    <Box
                      sx={{
                        width: { xs: '100%', sm: '100%', md: '400px', lg: '450px', xl: '500px' },
                        mb: 2,
                        textAlign: 'center',
                      }}
                    >
                      <img src={q.image} alt={`Soal ${soalNumber}`} style={{ maxWidth: '100%', borderRadius: 8 }} />
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
                                  <TableCell key={cIdx} colSpan={cell.colspan || 1} sx={{ textAlign: 'center' }}>
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

                  <RadioGroup value={answers[q.id] || ''} onChange={(e) => onAnswerChange(q.id, e.target.value)}>
                    {q.options.map((opt) => (
                      <FormControlLabel
                        key={opt.id}
                        value={opt.id}
                        control={<Radio />}
                        label={<Typography sx={{ fontSize: currentFontSize }}>{parseTextWithMath(opt.text)}</Typography>}
                      />
                    ))}
                  </RadioGroup>
                </CardContent>
              </Collapse>
            </Card>
          </div>
        );
      })}
    </Stack>
  );
};

export default QuestionForm;
