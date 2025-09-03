import { useEffect, useState, useRef } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Divider, Stack, Typography } from '@mui/material';

interface HotelKamar {
  nama: string;
  gambar: string;
  ukuran: string;
  ac_up: string;
  bed: string;
  tamu: string;
  harga: string;
  hotel_nama: string;
  var1: string;
  var2: string;
  var1icon: string;
  var2icon: string;
}

export default function ListHotel() {
  const [hotelKamar, setHotelKamar] = useState<HotelKamar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const textContent = searchParams.get('kesiniyuk');
        if (!textContent) {
          throw new Error('Text content not found in query parameters');
        }
        const response = await fetch(`https://tripselbe.fly.dev/hotel-kamar/${encodeURIComponent(textContent)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch hotel data');
        }
        const data = await response.json();
        setHotelKamar(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        setError('Failed to fetch hotel data');
        setLoading(false);
      }
    };

    fetchHotelData();
  }, []);

  useEffect(() => {
    if (loading) return;

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement;
          lazyImage.src = lazyImage.dataset.src || '';
          observer.current?.unobserve(lazyImage);
        }
      });
    });

    const images = document.querySelectorAll('.lazy-load-image');
    images.forEach((image) => {
      observer.current?.observe(image);
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Stack direction={'column'} gap={5}>
      {hotelKamar.map((hotel, index) => (
        <Stack key={index} width={'100%'} height={'312px'} borderRadius={'40px 0px'} boxShadow={'0px 0px 20px 0px rgba(0, 0, 0, 0.25)'} direction={'row'}>
          <Stack width={'35%'} height={'100%'} sx={{ background: '#04214C' }} borderRadius={'40px 0px 0px 0px'} >
            {/* Render hotel image */}
            <img src={hotel.gambar} alt="Hotel" data-src={hotel.gambar} className="lazy-load-image" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '40px 0px 0px 0px' }} />
          </Stack>
          {/* tengah */}
          <Stack width={'37%'} direction={'column'} paddingLeft={'20px'} justifyContent={'center'} paddingTop={'20px'} paddingBottom={'20px'} paddingRight={'20px'} gap={2}>
            {/* Render kamar name */}
            <Stack gap={1}>
              <Typography fontSize={'32px'} fontWeight={600} color={'#04214C'}>
              {hotel.nama.length > 20 ? `${hotel.nama.substring(0, 20)}...` : hotel.nama}
                </Typography>
              {/* render kamar icon */}
              <Stack direction={'row'} gap={2}>
                <Stack direction={'row'} gap={2}>
                  <Stack sx={{background:'#0E336C'}} direction={'row'} borderRadius={'15px'} justifyContent={'center'} alignItems={'center'} gap={1} padding={' 1px 15px'}>
                    <Icon icon="material-symbols:meeting-room" width="20" height="20" style={{ color: '#FFF' }} />
                    <Typography fontWeight={600} fontSize={'16px'} color={'#FFF'}>
                      {hotel.ukuran} m<span style={{ fontSize: '14px', verticalAlign: 'super' }}>2</span>
                    </Typography>
                  </Stack>
                  {hotel.ac_up ==='true' && (
                    <Stack direction={'row'} gap={1}>
                      <Stack sx={{background:'#0E336C'}} direction={'row'} borderRadius={'15px'} justifyContent={'center'} alignItems={'center'} gap={1} padding={' 1px 15px'}>
                        <Icon icon="material-symbols:meeting-room" width="20" height="20" style={{ color: '#FFF' }} />
                        <Typography fontWeight={600} fontSize={'16px'} color={'#FFF'}>
                          AC
                        </Typography>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Stack>
            {/* bed dan tamu */}
            <Divider/>
            <Stack direction={'column'} gap={1}>
              <Stack direction={'row'} borderRadius={'15px'} gap={1} padding={' 1px 15px'}>
                <Icon icon="ion:bed" width="20" height="20" style={{ color: '#FF010C' }} />
                <Typography fontWeight={400} fontSize={'16px'} color={'#04214C'}>
                  {hotel.bed}
                </Typography>
              </Stack>
              <Stack direction={'row'} borderRadius={'15px'} gap={1} padding={' 1px 15px'}>
                <Icon icon="ic:round-person" width="20" height="20" style={{ color: '#FF010C' }} />
                <Typography fontWeight={400} fontSize={'16px'} color={'#04214C'}>
                  {/* {hotel.tamu} */}
                  2 Tamu
                </Typography>
              </Stack>
            </Stack>
            {/* balkon dan sarapan */}
            <Divider/>
            <Stack direction={'column'} gap={1}>
            {hotel.var1 ==='true' && (
              <Stack direction={'row'} borderRadius={'15px'} gap={1} padding={' 1px 15px'}>
                <Icon icon="material-symbols:balcony-rounded" width="20" height="20" style={{ color: '#FF010C' }} />
                <Typography fontWeight={400} fontSize={'16px'} color={'#04214C'}>
                  {/* {hotel.var1} */}
                  Balkon
                </Typography>
              </Stack>
            )}
             {hotel.var1 ==='false' && (
              <Stack direction={'row'} borderRadius={'15px'} gap={1} padding={' 1px 15px'}>
                <Icon icon="material-symbols:balcony-rounded" width="20" height="20" style={{ color: '#6E6C6C' }} />
                <Typography fontWeight={400} fontSize={'16px'} color={'#04214C'}>
                  {/* {hotel.var1} */}
                  Tidak Ada Balkon
                </Typography>
              </Stack>
            )}
            {hotel.var2 ==='true' && (
              <Stack direction={'row'} borderRadius={'15px'} gap={1} padding={' 1px 15px'}>
                <Icon icon="mingcute:fork-spoon-fill" width="20" height="20" style={{ color: '#FF010C' }} />
                <Typography fontWeight={400} fontSize={'16px'} color={'#04214C'}>
                  {/* {hotel.var2} */}Termasuk Sarapan
                </Typography>
              </Stack>
            )}
            {hotel.var2 ==='false' && (
              <Stack direction={'row'} borderRadius={'15px'} gap={1} padding={' 1px 15px'}>
                <Icon icon="mingcute:fork-spoon-fill" width="20" height="20" style={{ color: '#6E6C6C' }} />
                <Typography fontWeight={400} fontSize={'16px'} color={'#04214C'}>
                  {/* {hotel.var2} */}Tidak Termasuk Sarapan
                </Typography>
              </Stack>
            )}
            </Stack>
          </Stack>
          {/* kanan */}
          <Stack width={'30%'} direction={'row'} justifyContent={'space-between'}>
            <Stack width={'1px'} height={'100%'} sx={{background:'rgba(0, 0, 0, 0.12)'}}/>
            <Stack direction={'column'} justifyContent={'center'} paddingRight={'20px'} alignItems={'right'}>
              <Typography fontSize={'32px'} color={'#FF010C'} fontWeight={500} textAlign={'right'}>Mulai Dari</Typography>
              <Typography fontSize={'40px'} color={'#04214C'} fontWeight={700} textAlign={'right'}>
                {hotel.harga.split(',').map(Number).sort((a, b) => a - b).map((value, i, array) => (i === 0 ? 'Rp' : '') + value.toLocaleString().replace(/,/g, '.') + (i === 0 ? '  ' : '') + (i === array.length - 1 ? '' : 'Rp') )}
              </Typography>
              <Typography fontSize={'18px'} color={'#04214C'} fontWeight={600} textAlign={'right'}>Harga spesial untuk T-Flyers</Typography>
            </Stack>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
