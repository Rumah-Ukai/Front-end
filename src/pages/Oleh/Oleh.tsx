import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Dragablealamat from '../../components/oleholeh/dragablealamat';
import './Oleh.css';
interface OlehData {
  nama: string;
  gambar_url1: string;
  gambar_url2: string;
  gambar_url3: string;
  tiket_masuk: string;
  parkir: string;
  description: string;
  domisili: string;
  single_alamat: string;
}

export default function Oleh() {
  const [data, setData] = useState<OlehData | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  useEffect(() => {
  document.body.style.marginTop = '0px';
  window.scrollTo(0, 0);
}, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const textContent = searchParams.get('kesiniyuk');
        if (!textContent) {
          throw new Error('Text content not found in query parameters');
        }
        const response = await fetch(`https://tripselbe.fly.dev/oleh/${encodeURIComponent(textContent)}`);
        const result = await response.json();
        if (result) {
          setData(result);
          setImageLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Display gray placeholders until data is loaded or data is empty
  if (!data) {
    return (
      <Stack gap={3}>
        <Stack direction={'row'} gap={3} width={'100%'}>
          <Stack height={'510px'} width={'50%'} className='loading'></Stack>
          <Stack direction={'column'} gap={4} width={'50%'}>
            <Stack height={'240px'} width={'100%'} className='loading'></Stack>
            <Stack height={'240px'} width={'100%'} className='loading'></Stack>
          </Stack>
        </Stack>

        <Stack gap={3} marginLeft={'80px'} marginRight={'80px'}>
          <Typography fontFamily={'TelkomselBatikBold'} fontSize={'50px'} color={'#04214C'}>
            Loading...
          </Typography>
          <Stack gap={3} direction={'row'}>
            <Stack
              flexWrap={'wrap'}
              sx={{
                width: 'auto',
                height: '70px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '40px',
                background: 'white',
                color: 'red',
                cursor: 'pointer',
                boxShadow: '0px 0px 0px 2px red',
                padding: '0px 40px',
              }}
            >
              <Typography noWrap fontSize={'24px'} sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                Loading...
              </Typography>
            </Stack>
            <Stack
              flexWrap={'wrap'}
              sx={{
                width: 'auto',
                height: '70px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '40px',
                background: 'white',
                color: 'red',
                cursor: 'pointer',
                boxShadow: '0px 0px 0px 2px red',
                padding: '0px 40px',
              }}
            >
              <Typography noWrap fontSize={'24px'} sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                Loading...
              </Typography>
            </Stack>
          </Stack>
          <Typography fontSize={'32px'} textAlign={'justify'} color={'#04214C'}>
            Loading...
          </Typography>
          <Typography fontSize={'42px'} fontWeight={600} color={'#FF010C'}>
            Loading...
          </Typography>
          <Dragablealamat />
        </Stack>
      </Stack>
    );
  }
  const imageUrls = [data.gambar_url1, data.gambar_url2, data.gambar_url3].filter(Boolean);

  return (
    <Stack gap={3}>
         <Stack direction={'row'} gap={3} width={'100%'}>
      <Stack gap={2} sx={{ height: '100%', width: '100%', margin: '0 auto' }}>
  {imageUrls.length === 1 && (
   <Stack direction={'row'} height={'720px'} justifyContent={'center'} alignItems={'center'} gap={1}>
   <Stack className='loading' sx={{ backgroundColor: imageLoading ? 'lightgray' : 'inherit', height: '100%', width: '50%' }}>
       {!imageLoading && (
         <img
           src={imageUrls[0]}
           onLoad={() => setImageLoading(false)}
           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
           alt="Image1"
         />
       )}
     </Stack>

   </Stack>
  )}
  {imageUrls.length === 2 && (
    <>
 <Stack direction={'row'} height={'720px'} justifyContent={'space-between'} gap={1}>
    <Stack className='loading' sx={{ backgroundColor: imageLoading ? 'lightgray' : 'inherit', height: '100%', width: '50%' }}>
        {!imageLoading && (
          <img
            src={imageUrls[0]}
            onLoad={() => setImageLoading(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Image1"
          />
        )}
      </Stack>
      <Stack gap={1} width={'50%'}>
      <Stack className='loading' sx={{ backgroundColor: imageLoading ? 'lightgray' : 'inherit', height: '100%', width: '100%' }}>
        {!imageLoading && (
          <img
            src={imageUrls[1]}
            onLoad={() => setImageLoading(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Image2"
          />
        )}
      </Stack>
      </Stack>
    </Stack>
    
    </>
  )}
  {imageUrls.length === 3 && (
    <>
    <Stack direction={'row'} height={'720px'} justifyContent={'space-between'} gap={1}>
    <Stack className='loading' sx={{ backgroundColor: imageLoading ? 'lightgray' : 'inherit', height: '100%', width: '50%' }}>
        {!imageLoading && (
          <img
            src={imageUrls[0]}
            onLoad={() => setImageLoading(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Image1"
          />
        )}
      </Stack>
      <Stack gap={1} width={'50%'}>
      <Stack className='loading' sx={{ backgroundColor: imageLoading ? 'lightgray' : 'inherit', height: '49%', width: '100%' }}>
        {!imageLoading && (
          <img
            src={imageUrls[1]}
            onLoad={() => setImageLoading(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Image2"
          />
        )}
      </Stack>
      <Stack className='loading' sx={{ backgroundColor: imageLoading ? 'lightgray' : 'inherit', height: '50%', width: '100%' }}>
        {!imageLoading && (
          <img
            src={imageUrls[2]}
            onLoad={() => setImageLoading(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Image3"
          />
        )}
      </Stack>
      </Stack>
    </Stack>
      
      
    </>
  )}
</Stack>


      </Stack>

      <Stack gap={3} marginLeft={'80px'} marginRight={'80px'}>
        <Typography fontFamily={'TelkomselBatikBold'} fontSize={'50px'} color={'#04214C'}>
          {data.nama || 'Loading...'}
        </Typography>
        <Stack gap={3} direction={'row'}>
          <Stack
            flexWrap={'wrap'}
            sx={{
              width: 'auto',
              height: '70px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '40px',
              background: 'white',
              color: 'red',
              cursor: 'pointer',
              boxShadow: '0px 0px 0px 2px red',
              padding: '0px 40px',
            }}
          >
            <Typography noWrap fontSize={'24px'} sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
              {`Tiket Masuk : ${data.tiket_masuk || 'Loading...'}`}
            </Typography>
          </Stack>
          <Stack
            flexWrap={'wrap'}
            sx={{
              width: 'auto',
              height: '70px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '40px',
              background: 'white',
              color: 'red',
              cursor: 'pointer',
              boxShadow: '0px 0px 0px 2px red',
              padding: '0px 40px',
            }}
          >
            <Typography noWrap fontSize={'24px'} sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
              {`Parkir : ${data.parkir || 'Loading...'}`}
            </Typography>
          </Stack>
        </Stack>
        <Typography fontSize={'32px'} textAlign={'justify'} color={'#04214C'}>
          {data.description || 'Loading...'}
        </Typography>
        <Typography fontSize={'42px'} fontWeight={600} color={'#FF010C'}>
          Alamat
        </Typography>
        <Dragablealamat />
        {data.single_alamat && (
        <Stack width={'100%'} height={'600px'} className='loading' sx={{
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          borderRadius: '0px 40px',
          justifyContent: 'center',
        }}>
          <iframe src={data.single_alamat}
            width="100%" height="100%" className='loading' frameBorder={'0px'} style={{ borderRadius: '0px 30px' }}></iframe>
        </Stack>
      )}
      </Stack>
    </Stack>
  );
}
