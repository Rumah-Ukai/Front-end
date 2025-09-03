import { useRef, useState, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../pages/Oleh/Oleh.css';

interface Location {
  nama: string;
  gambar_url1: string;
  domisili: string;
}

interface Recommendation {
  nama: string;
  domisili: string | null;
}

interface DragableAlamatProps {
  domisili: string; // Define the prop types
}

export default function DragableAlamat(props: DragableAlamatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [addresses, setAddresses] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`https://tripselbe.fly.dev/wisata`);
        if (!response.ok) {
          console.error('Error fetching addresses:', response.statusText);
          setLoading(false);
          return;
        }
        const data: Location[] = await response.json();
  
        // Fetch the recommendations
        const recommendationResponse = await fetch(`https://tripselbe.fly.dev/wisatarecomend`);
        if (!recommendationResponse.ok) {
          console.error('Error fetching recommendations:', recommendationResponse.statusText);
          setLoading(false);
          return;
        }
        const recommendations: Recommendation[] = await recommendationResponse.json();
  
        // Filter addresses based on the recommendations and domisili, case-insensitive
        const filteredAddresses = data.filter(address => 
          recommendations.some(recommendation => 
            recommendation.nama.toLowerCase() === address.nama.toLowerCase() && recommendation.domisili?.toLowerCase() === props.domisili.toLowerCase()
          )
        );
        
        setAddresses(filteredAddresses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
    fetchAddresses();
  }, [props.domisili]);

  const handleItemClick = (name: string) => {
    navigate(`/cari-wisata?kesiniyuk=${encodeURIComponent(name)}`);
  };

  if (loading) {
    // Display loading state while data is being fetched
    return (
      <Stack direction="row" height={'auto'}>
          <Typography sx={{
            fontWeight: 700,
            color: '#ff010c',
            fontSize: '60px',
            paddingTop: '50px',
            paddingBottom: '30px',
            textAlign: 'center'
          }}>
            Area Populer
          </Typography>
        <Stack
          ref={containerRef}
          direction="row"
          spacing={3}
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            '-ms-overflow-style': 'none',
            scrollbarWidth: 'none',
            overflowX: 'auto',
            maxWidth: '100%',
            width: '100%'
          }}
        >
          {[...Array(2)].map((_, index) => (
            <Stack key={index} className='loading' sx={{ backgroundColor: 'lightgray', width: '579px', height: '300px', borderRadius: '40px 0px' }}>
            </Stack>
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack>
{addresses.length > 0 && (
        <Typography sx={{
            fontWeight: 700,
            color: '#ff010c',
            fontSize: '60px',
            paddingTop: '50px',
            paddingBottom: '30px',
            textAlign: 'center'
          }}>
            Area Populer
          </Typography>
          )}
    <Stack direction="row" width={'auto'}>
      
      <Stack
        ref={containerRef}
        direction="row"
        spacing={3}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none',
          scrollbarWidth: 'none',
          overflowX: 'auto',
          maxWidth: '100%',
          width: '100%'
        }}
      >
        {addresses.map((address, index) => (
          <Stack key={index}>
            <Stack
              width={'579px'}
              height={'300px'}
              sx={{
                backgroundImage: `url(${address.gambar_url1})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                borderRadius: '40px 0px'
              }}
              onClick={() => handleItemClick(address.nama)}
            >
              <Typography fontSize={'42px'} fontWeight={500} color={'#fff'} marginTop={'220px'} marginLeft={'40px'}>
                {address.nama}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
    </Stack>
  );
}
