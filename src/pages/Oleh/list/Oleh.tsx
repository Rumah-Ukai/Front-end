import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import '../../../assets/font/telkomselbatik.css'
import GridOrange from '../../../components/oleholeh/gridorange'
import balithumb from '../../../assets/oleholeh/bali/baliup.png';
import loading from '../../../assets/restoran/comingsoongray.png';

interface OlehDataItem {
  nama: string;
  gambar_url1: string;
  gambar_url2: string;
  gambar_url3: string;
  tiket_masuk: string;
  parkir: string;
  description: string;
  domisili: string;
  jarak: string;
}
interface OrangewithimageProps {
  imageSrc: string;
  textContent: string;
  jarak: string;
  domisili: string;
}

interface Area {
  domisili: string;
  coverresto: string;
}
const Oleh = () => {
  const [olehData, setOlehData] = useState<OrangewithimageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [destination, setDestination] = useState<string | null>(null);
  const [areaData, setAreaData] = useState<Area| null>(null);
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gasParam = params.get('Gas');
    setDestination(gasParam);
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
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.marginTop = '-120px';
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://tripselbe.fly.dev/oleh');
        const data: OlehDataItem[] = await response.json();
        // Filter the data to include only items where domisili is equal to 'bali'
        const filteredData: OlehDataItem[] = data.filter(item => item.domisili === `${destination}`);
        const transformedData: OrangewithimageProps[] = filteredData.map(item => ({
          imageSrc: item.gambar_url1 || item.gambar_url2 || item.gambar_url3 || '',
          textContent: item.nama,
          jarak: item.jarak,
          domisili:item.domisili
        }));
        setOlehData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching data
      }
    };
    fetchData();
  }, [destination]);

  return (
    <Stack gap={3}>
      <Stack sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: '0px',
      }} gap={0}>
        <Stack sx={{
          backgroundImage: `linear-gradient(180deg, transparent 50.5%, white 100%), url(${areaData?.coverresto ||balithumb})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          height: '504px',
          justifyContent: 'center',
          width: '100%',
          margin: '0',
          
        }}>
          <Stack justifyContent={'center'} alignItems={'center'} textAlign={'center'}>
          <Typography
      sx={{
        fontSize: { xs: '60px', md: '70px' },
        color: '#fff',
        fontFamily: 'TelkomselBatikBold',
      }}
    >Oleh-Oleh</Typography>
                   <Typography
      sx={{
        fontSize: { xs: '60px', md: '70px' },
        color: '#fff',
        fontFamily: 'TelkomselBatikBold',
      }}
    >{areaData?.domisili}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack sx={{marginBottom:'265px'}}>
      {isLoading ? (
        <Stack width={'100%'} height={'1315px'} justifyContent={'center'} alignItems={'center'}>
          <img src={loading} alt="Loading" style={{ width: '700px', height: '700px' }} />
          </Stack>
        ) : (
          <GridOrange Data={olehData} />
        )}
      </Stack>
    </Stack>
  );
};

export default Oleh;
