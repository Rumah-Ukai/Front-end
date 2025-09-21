// src/pages/Beranda/Beranda.tsx
import { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import RowAndColumnSpacing from '../../../components/beranda/cardpaketku';


export default function Beranda() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bgClr2 = '#f0f0f0ff';



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
