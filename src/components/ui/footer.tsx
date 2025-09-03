import { Stack, Typography } from '@mui/material';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import logoTripsel from '../../assets/logoukai.png';

import { useNavigate } from 'react-router-dom';


export default function Navbar() {
  const navigate = useNavigate();

  function handleTentangKamiClick() {
    navigate('/aboutus');
  }

  function handleSocialMediaClick(url: string) {
    window.open(`${url}`, '_blank');
  }

  return (
    <Stack 
      direction={{ xs: 'column', md: 'row' }} 
      sx={{
        display: 'flex',
        height: { xs: 'auto', md: '440px' },
        width: '100%',
        margin: '0',
        backgroundColor: 'white',
        padding: { xs: '0px', md: '20' },
        alignItems:'center',
      }}
    >
      <Stack 
        width={{ xs: '200px', md: '200px' }} 
        sx={{
          justifyContent:'center',
          padding: { xs: '20px 0', md: '175px 100px' },
          alignItems: 'center',
          textAlign: { xs: 'center', md: 'center' },
        }}
      >
        <img src={logoTripsel} alt="Logo Tripsel" width={'100%'} />
        <Stack direction='row' gap={1} paddingTop={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
  
        </Stack>
      </Stack>

      <Stack 
        sx={{
          padding: { xs: '20px', md: '50px' },
          textAlign: { xs: 'center', md: 'left' },
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Typography sx={{
          color: '#04214c',
          fontWeight: 600,
          fontSize: { xs: 20, md: 25 },
          fontFamily: 'TelkomselBatikBold'
        }}>
          Tentang Rumah Ukai
        </Typography>

        <Typography
          sx={{
            color: '#04214c',
            fontWeight: 400,
            fontSize: { xs: 18, md: 20 },
            paddingTop: 1,
            cursor: 'pointer',
          }}
          onClick={handleTentangKamiClick}
        >
          Tentang Kami
        </Typography>
        <Typography
          sx={{
            color: '#04214c',
            fontWeight: 400,
            fontSize: { xs: 18, md: 20 },
            paddingTop: 1,
            cursor: 'pointer',
          }}
        >
          Kontak
        </Typography>

        <Typography sx={{
          color: '#04214c',
          fontWeight: 600,
          fontSize: { xs: 20, md: 25 },
          paddingTop: '46px',
          fontFamily: 'TelkomselBatikBold'
        }}>
          Ikuti Rumah Ukai
        </Typography>
        <Typography
          sx={{
            color: '#04214c',
            fontWeight: 400,
            fontSize: { xs: 18, md: 20 },
            paddingTop: 1,
            cursor: 'pointer',
          }}
          onClick={() => handleSocialMediaClick('https://www.instagram.com/trip.sel?igsh=c3B3Njg2emNpeHl0')}
        >
          Instagram
        </Typography>

        <Typography
          sx={{
            color: '#04214c',
            fontWeight: 400,
            fontSize: { xs: 18, md: 20 },
            paddingTop: 1,
            cursor: 'pointer',
          }}
          onClick={() => handleSocialMediaClick('https://www.tiktok.com/@tripwithtelkomsel?_t=8mgAFMj8Esi&_r=1')}
        >
          TikTok
        </Typography>

        <Typography
          sx={{
            color: '#04214c',
            fontWeight: 400,
            fontSize: { xs: 18, md: 20 },
            paddingTop: 1,
            cursor: 'pointer',
          }}
          onClick={() => handleSocialMediaClick('https://youtube.com/@tripsel?si=O7GZD7Q0Wyb6SL82')}
        >
          YouTube
        </Typography>

      </Stack>

    
    
    </Stack>
  );
}
