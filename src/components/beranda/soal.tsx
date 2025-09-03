// QuestionForm.tsx
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
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

interface Question {
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
  flaggedQuestions: number[];
  onToggleFlag: (id: number) => void;
  fontSize: 'small' | 'normal' | 'large';
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

// ✅ Tambahkan helper untuk parse table string dari DB
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
  const parts = text.split(/(\$\$.*?\$\$)/g); // split by $$...$$
  return parts.map((part, idx) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const mathContent = part.slice(2, -2); // remove $$
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
}) => {
  const visibleQuestions = selectedQuestionId
    ? questions.filter((q) => q.id === selectedQuestionId)
    : questions;

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  // const toggleExpand = (id: number) => {
  //   setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  // };

  useEffect(() => {
    if (selectedQuestionId) {
      setExpanded((prev) => ({ ...prev, [selectedQuestionId]: true }));
    } else {
      setExpanded(Object.fromEntries(questions.map((q) => [q.id, true])));
    }
  }, [selectedQuestionId, questions]);

  return (
    <Stack spacing={1} sx={{ width: '100%', height: '100%' }}>
      {visibleQuestions.map((q) => {
        const isFlagged = flaggedQuestions.includes(q.id);
        const currentFontSize = getFontSize(fontSize);

        // ✅ parse table jika ada
        const parsedTable = parseTable(q.table);

        return (
          <Card
            key={q.id}
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <CardHeader
              sx={{ backgroundColor: '#1976d2', py: 1 }}
              title={
                <Typography variant="subtitle1" fontWeight="bold" color="white">
                  Soal {q.id}
                </Typography>
              }
              action={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Tooltip title={isFlagged ? 'Unflag soal ini' : 'Flag soal ini'} arrow>
                    <IconButton
                      size="small"
                      onClick={() => onToggleFlag(q.id)}
                      sx={{
                        color: isFlagged ? 'error.main' : 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      <FlagIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {/* <IconButton size="small" onClick={() => toggleExpand(q.id)}>
                    <ExpandMoreIcon
                      sx={{
                        transform: expanded[q.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: '0.3s',
                        color: 'white',
                        fontSize: 20,
                      }}
                    />
                  </IconButton> */}
                </Box>
              }
            />

            <Collapse in={expanded[q.id]} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2, fontSize: currentFontSize }}>
                   {parseTextWithMath(q.text)}
                </Typography>

                {q.image && (
                  <Box sx={{ width: { xs: '100%', sm: '100%', md: '400px', lg: '450px', xl: '500px' }, mb: 2, textAlign: 'center' }}>
                    <img src={q.image} alt={`Soal ${q.id}`} style={{ maxWidth: '100%', borderRadius: 8 }} />
                  </Box>
                )}

                {/* ✅ tampilkan tabel */}
                {parsedTable && (
                  <Box sx={{ mb: 2, overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {parsedTable.headers.map((header, idx) => (
                            <TableCell key={idx} sx={{ fontWeight: 'bold' }}>
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
                                <TableCell key={cIdx} colSpan={cell.colspan || 1} sx={{textAlign:'center'}}>
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
                      label={<Typography sx={{ fontSize: currentFontSize }}>  {parseTextWithMath(opt.text)}</Typography>}
                    />
                  ))}
                </RadioGroup>
              </CardContent>
            </Collapse>
          </Card>
        );
      })}
    </Stack>
  );
};

export default QuestionForm;
