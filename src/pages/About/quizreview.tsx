// src/pages/About/quizreview.tsx
import { useEffect } from 'react';
import { Stack, Typography, Button } from '@mui/material';
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
  WidthType,
  ImageRun,
} from 'docx';

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
  image_url?: string | null;
  table_headers?: string | null;
  table_rows?: string | null;
  explanation_image_url?: string | null;
  explanation_table_headers?: string | null;
  explanation_table_rows?: string | null;
}

export default function QuizReview() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const parseTable = (
    headers?: string | null,
    rows?: string | null
  ): { headers: string[]; rows: string[][] } | null => {
    if (!headers || !rows) return null;
    const headerArr = headers.split('|').map((h) => h.trim());
    const rowArr = rows
      .split(';')
      .map((r) => r.split('|').map((c) => c.trim()))
      .filter((r) => r.length > 0);
    return { headers: headerArr, rows: rowArr };
  };

  const buildDocxTable = (headers: string[], rows: string[][]): Table => {
    const tableRows: TableRow[] = [];

    tableRows.push(
      new TableRow({
        children: headers.map(
          (h) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
            })
        ),
      })
    );

    rows.forEach((r) => {
      tableRows.push(
        new TableRow({
          children: r.map(
            (c) =>
              new TableCell({
                children: [new Paragraph({ children: [new TextRun(c)] })],
              })
          ),
        })
      );
    });

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    });
  };

  const makePara = (
    text: string,
    { bold, color, center }: { bold?: boolean; color?: string; center?: boolean } = {}
  ) =>
    new Paragraph({
      alignment: center ? AlignmentType.CENTER : undefined,
      children: [new TextRun({ text, bold, color })],
    });

  const fetchImageAsUint8 = async (url: string): Promise<Uint8Array | null> => {
    try {
      const resp = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
      return new Uint8Array(resp.data);
    } catch {
      return null;
    }
  };

  const handleDownloadWord = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan.');

      const { data } = await axios.get<Question[]>(
        'http://localhost:3000/questions?tryoutId=TO2025_MTK1',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rows: TableRow[] = [];

      rows.push(
        new TableRow({
          children: [
            new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [makePara('No', { bold: true, center: true })] }),
            new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, children: [makePara('Soal', { bold: true, center: true })] }),
            new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, children: [makePara('Pembahasan', { bold: true, center: true })] }),
          ],
        })
      );

      for (let i = 0; i < data.length; i++) {
        const q = data[i];

        const soalChildren: (Paragraph | Table)[] = [];
        soalChildren.push(makePara(q.question_text || ''));

        (['a', 'b', 'c', 'd', 'e'] as const).forEach((k) => {
          const text = q[`option_${k}` as const] ?? '';
          if (!text) return;
          const isCorrect = (q.answer_key ?? '').toLowerCase() === k;
          soalChildren.push(makePara(`${isCorrect ? '✓ ' : ''}${k.toUpperCase()}. ${text}`, {
            bold: isCorrect,
            color: isCorrect ? '008000' : undefined,
          }));
        });

        if (q.image_url) {
          const bytes = await fetchImageAsUint8(q.image_url);
          if (bytes) {
            soalChildren.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: bytes as unknown as Buffer, // ✅ fix TS
                    transformation: { width: 300, height: 200 },
                  }),
                ],
              })
            );
          } else {
            soalChildren.push(makePara('[Gambar gagal dimuat]', { color: '888888', center: true }));
          }
        }

        const soalTbl = parseTable(q.table_headers, q.table_rows);
        if (soalTbl) soalChildren.push(buildDocxTable(soalTbl.headers, soalTbl.rows));

        const pembahasanChildren: (Paragraph | Table)[] = [];
        if (q.explanation) pembahasanChildren.push(makePara(q.explanation));

        if (q.explanation_image_url) {
          const bytes = await fetchImageAsUint8(q.explanation_image_url);
          if (bytes) {
            pembahasanChildren.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: bytes as unknown as Buffer, // ✅ fix TS
                    transformation: { width: 300, height: 200 },
                  }),
                ],
              })
            );
          } else {
            pembahasanChildren.push(makePara('[Gambar pembahasan gagal dimuat]', { color: '888888', center: true }));
          }
        }

        const expTbl = parseTable(q.explanation_table_headers, q.explanation_table_rows);
        if (expTbl) pembahasanChildren.push(buildDocxTable(expTbl.headers, expTbl.rows));

        rows.push(
          new TableRow({
            children: [
              new TableCell({ children: [makePara(String(i + 1), { center: true })] }),
              new TableCell({ children: soalChildren }),
              new TableCell({ children: pembahasanChildren }),
            ],
          })
        );
      }

      const table = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows });
      const doc = new Document({ sections: [{ properties: {}, children: [table] }] });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'Soal_Tryout.docx');
    } catch (e) {
      console.error('Gagal membuat file Word:', e);
    }
  };

  return (
    <Stack sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
      <Typography variant="h4">Review Tryout</Typography>
      <Button variant="contained" onClick={handleDownloadWord}>Download Soal (Word)</Button>
    </Stack>
  );
}
