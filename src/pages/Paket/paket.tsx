import { useEffect, useState } from 'react';
import { Stack, Typography, Paper } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

interface Tryout {
  id: string;
  name: string;
  description: string;
  created_at: string;
  paket_id: string;
}

export default function Paket() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paketId = searchParams.get('id');

  useEffect(() => {
    const fetchTryouts = async () => {
      if (!paketId) {
        setError('Paket ID tidak ditemukan');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token'); // ambil JWT
        const tryoutRes = await axios.get('http://localhost:3000/tryouts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tryoutsArray = Array.isArray(tryoutRes.data) ? tryoutRes.data : [];
        const filteredTryouts = tryoutsArray.filter((t: Tryout) => t.paket_id === paketId);
        setTryouts(filteredTryouts);
      } catch (err) {
        console.error('Error fetching tryouts:', err);
        setError('Gagal mengambil data tryout');
      } finally {
        setLoading(false);
      }
    };

    fetchTryouts();
  }, [paketId]);

const handleTryoutClick = (tryout: Tryout) => {
  navigate(`/tryouts?id=${tryout.id}`);
};


  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Daftar Tryout Paket
      </Typography>

      {tryouts.length === 0 ? (
        <Typography>Tidak ada tryout untuk paket ini</Typography>
      ) : (
        <Stack spacing={2}>
          {tryouts.map((tryout) => (
            <Paper
              key={tryout.id}
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
              onClick={() => handleTryoutClick(tryout)}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {tryout.name}
              </Typography>
              <Typography variant="body2">{tryout.description}</Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
