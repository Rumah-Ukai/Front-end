import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import axios from 'axios';
import bali from '../../../assets/aboutbali.jpg';
import RowAndColumnSpacing from '../../../components/about/dragablealamat';
import Balimenunggu  from '../../../components/about/ayokunjungi';
import nusapenida from '../../../assets/about/nusapenida.jpg'
import '../../../assets/font/telkomselbatik.css'

interface Area {
  domisili: string;
  coverabout: string;
  footerabout: string;
  deskripsiabout: string;
}
export default function Beranda() {
  const location = useLocation();
  const [destination, setDestination] = useState<string | null>(null);
  const [areaData, setAreaData] = useState<Area| null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gasParam = params.get('Gas');
    setDestination(gasParam);
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.marginTop = '-120px';
    // window.scrollTo(0, 0); // Scroll to the top of the page when the component is mounted or navigation occurs
  }, [location.search]);
  useEffect(() => {
    if (destination) {
      // Fetch the area data from the backend
      axios.get(`https://tripselbe.fly.dev/area/${destination}`)
        .then((response) => {
          setAreaData(response.data);
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error fetching area data:', error);
        });
    }
  }, [destination]);

  return (
    <Stack sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginLeft: '0px',
    }} gap={0}>
  
      <Stack sx={{
        backgroundImage: `linear-gradient(180deg, transparent 56.5%, #04214C 100%), url(${areaData?.coverabout || bali})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        height: '527px',
        justifyContent: 'center',
        width: '100%',
        margin: '0',
      }}>
        <Stack justifyContent={'center'} alignItems={'center'} textAlign={'center'}>
          <Typography fontSize={'82px'} fontFamily={'TelkomselBatikBold'} color={'#FFF'}> {areaData?.domisili}</Typography>
        </Stack>
      </Stack>
      <Stack sx={{
        display: 'flex',
        height: 'auto',
        width: '100%',
        margin: '0',
        marginTop:'-1px',
        backgroundColor: '#04214c',
        borderRadius: '0 0 100px 100px',
        paddingBottom:'80px'
      }}>
<Stack gap={4} marginLeft={{ xs: '20px', md: '145px' }} marginRight={{ xs: '20px', md: '145px' }} >
        <Typography sx={{
          fontWeight: 400,
          color: 'white',
          fontSize: '25px',
          textAlign: {xs: 'justify', md: 'left'} ,
          whiteSpace: 'pre-line',

        }}>
        {areaData?.deskripsiabout}
        </Typography>
        
</Stack>
      </Stack>

      <Stack sx={{
        display: 'flex',
        height: 'auto',
        width: '100%',
        paddingTop: '50px',
        paddingBottom:'50px',
        backgroundColor: 'white',
      }}>

        <Stack sx={{
          height: 'auto',
          width: '100%',
          backgroundColor: 'white',
        }}>

          <Stack >
         
          <Balimenunggu domisili={destination || 'bali'} />
        </Stack>

        <Stack width={'auto'} height={'auto'} marginLeft={'100px'} marginRight={'100px'} marginTop={'30px'} sx={{backgroundColor:'transparent'}}>
      
          <RowAndColumnSpacing domisili={destination || 'bali'} />
        </Stack>
        </Stack>
      </Stack>

      <Stack sx={{
        display: 'flex',
        height: 'auto',
        width: '100%',
        margin: '0',
        borderRadius: '100px 100px 0 0',
      }}>
        <Stack sx={{
        backgroundImage: `linear-gradient(180deg, transparent 0%, white 100%), url(${areaData?.footerabout || nusapenida})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        height: '554px',
        justifyContent: 'center',
        width: '100%',
        margin: '0',
      }}>
        <Stack justifyContent={'center'} alignItems={'center'} textAlign={'center'}>
          <Typography fontSize={'90px'} fontFamily={'TelkomselBatikBold'} color={'#04214C'}>Sampai berjumpa di {destination}!</Typography>
        </Stack>
        </Stack>
        <Stack width={'100%'} height={'3px'} marginTop={'-2px'} sx={{background:'white'}}>
        </Stack>
      </Stack>
    </Stack>
  );
}
