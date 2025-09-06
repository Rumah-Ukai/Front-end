// src/pages/Beranda/Beranda.tsx
import { useEffect } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import RowAndColumnSpacing from '../../../components/beranda/cardpaketku';

import axios from 'axios';
import { saveAs } from 'file-saver';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
} from 'docx';

// ✅ Interface biar nggak pakai any
interface Question {
  id: number;
  question_text: string;
  option_a?: string | null;
  option_b?: string | null;
  option_c?: string | null;
  option_d?: string | null;
  option_e?: string | null;
  answer_key: string;
  explanation?: string | null;
}

export default function Beranda() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bgClr2 = '#f0f0f0ff';

  // ========== FUNCTION DOWNLOAD WORD ==========
  async function handleDownloadWord() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan');
        return;
      }

      const res = await axios.get<Question[]>(
        'http://localhost:3000/questions?tryoutId=TO2025_MTK1',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const questions: Question[] = res.data;

      const rows: TableRow[] = [];

      // Header tabel
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'No', bold: true })],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Soal', bold: true }),
                    new TextRun({ text: ' & Pembahasan', bold: true }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
          ],
        })
      );

      // Isi tabel
      questions.forEach((q, idx) => {
        const soalPar = new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: q.question_text || '', bold: false })],
        });

        const optionsPar = new Paragraph({
          children: [
            new TextRun({
              text: `A. ${q.option_a || ''}\nB. ${q.option_b || ''}\nC. ${
                q.option_c || ''
              }\nD. ${q.option_d || ''}\nE. ${q.option_e || ''}`,
            }),
          ],
        });

        const answerPar = new Paragraph({
          children: [new TextRun({ text: `Jawaban: ${q.answer_key}` })],
        });

        const bahasPar = new Paragraph({
          children: [new TextRun({ text: q.explanation || '' })],
        });

        rows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: String(idx + 1),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [soalPar, optionsPar, answerPar, bahasPar],
              }),
            ],
          })
        );
      });

      const table = new Table({ rows });
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [table],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Soal_Tryout.docx`);
      console.log('File Word berhasil dibuat');
    } catch (err) {
      console.error('Gagal membuat file Word:', err);
    }
  }

  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        marginLeft: '0px',
        backgroundColor: bgClr2,
      }}
      gap={0}
    >
      <Stack width={'100%'} marginTop={'0px'} />

      <Stack
        sx={{
          display: 'flex',
          height: 'auto',
          width: '100%',
          margin: '0',
          borderRadius: '0 0 0px 0px',
          paddingLeft: { xs: '16px', md: '30px' },
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            color: 'black',
            fontSize: { xs: '28px', sm: '45px', md: '60px' },
            textAlign: 'left',
          }}
        >
          Paket Try out
        </Typography>

        <Typography
          sx={{
            fontWeight: 400,
            color: 'black',
            fontSize: { xs: '16px', sm: '20px', md: '25px' },
            textAlign: 'left',
          }}
        >
          Paket try out yang tersedia
        </Typography>

        {/* 🔽 Tombol Download Word */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: 'fit-content' }}
          onClick={handleDownloadWord}
        >
          Download Soal (Word)
        </Button>
      </Stack>

      <Stack
        width="auto"
        height="auto"
        marginLeft={{ xs: '16px', md: '60px' }}
        marginRight={{ xs: '16px', md: '60px' }}
        marginTop="30px"
        marginBottom="55px"
      >
        <RowAndColumnSpacing />
      </Stack>
    </Stack>
  );
}
