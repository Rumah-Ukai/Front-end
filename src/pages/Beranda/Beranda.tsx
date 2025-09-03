import { useEffect } from 'react';
import { Stack, Typography  } from '@mui/material';
// import bg from '../../assets/beranda/Bali.png';
import RowAndColumnSpacing from '../../components/beranda/cardpaket';
// import SwipeableHotelCarousel from '../../components/beranda/SwipeableHotelCaraousel';
// import YoutubeVideo from '../../components/beranda/youtube';
// import Balimenunggu from '../../components/beranda/balimenunggu';
// import BerandaData from './berandadata';
import '../../assets/font/telkomselbatik.css';

// interface BerandaData {
//   imageSrc: string;
//   textContent: string;
// }


export default function Beranda() {
  useEffect(() => {
    // document.body.style.margin = '0';
    // document.body.style.padding = '0';
    // document.body.style.marginTop = '-120px';
    window.scrollTo(0, 0);
  }, []);

  // const [berandaData, setBerandaData] = useState<BerandaData[]>([]);
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
          // paddingBottom: { xs: '80px', md: '145px' },
          paddingLeft: { xs: '16px', md: '30px' },
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            color: 'black',
            fontSize: { xs: '28px', sm: '45px', md: '60px' },
            // paddingTop: '50px',
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
            // marginBottom: '85px',
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
