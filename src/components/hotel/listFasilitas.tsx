import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Grid, Stack, Typography } from '@mui/material';

interface Fasilitas {
  nama: string;
  icon: string;
}

export default function ListHotel() {
  const [fasilitasData, setFasilitasData] = useState<Fasilitas[]>([]);

  useEffect(() => {
    const fetchFasilitasData = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hotelName = searchParams.get('kesiniyuk');
        if (!hotelName) {
          throw new Error('Hotel name not found in query parameters');
        }

        const response = await fetch(`https://tripselbe.fly.dev/hotel-fasilitas/${encodeURIComponent(hotelName)}`);
        const data = await response.json();
        setFasilitasData(data);
      } catch (error) {
        console.error('Error fetching fasilitas data:', error);
      }
    };

    fetchFasilitasData();
  }, []);

  return (
    <Grid container spacing={2}>
      {fasilitasData.map((fasilitas, index) => (
        <Grid item xs={6} sm={3} key={index} justifyContent={'right'} paddingBottom={'16px'}>
          <Stack direction={'row'} gap={1}>
          <Icon icon={fasilitas.icon} width="35" height="35" style={{ color: '#04214C' }} />
          <Typography color={'#04214C'} fontSize={'22px'} fontWeight={500}>{fasilitas.nama}</Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}
