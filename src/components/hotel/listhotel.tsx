import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Stack, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Hotel {
  gambar_url1: string;
  nama: string;
  harga: string;
  bintang?: number;
  lokasi?: string;
  telfon?: string;
  jarak?: string;
  thumbnailUrl?: string;
  fasilitas?: string[];
  domisili?: string;
}

interface ListHotelProps {
  selectedStars: number[];
  minimal: string;
  maximal: string;
  checkedFasilitas: string[];
  selectedDomisili: string;
  jenis: string;
}

export default function ListHotel({
  selectedStars,
  minimal,
  maximal,
  checkedFasilitas,
  selectedDomisili,
  jenis,
}: ListHotelProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 600px)'); // Adjust breakpoint as needed

  useEffect(() => {
    fetch('https://tripselbe.fly.dev/hotels')
      .then((response) => response.json())
      .then(async (data: Hotel[]) => {
        const hotelsWithThumbnailsAndFasilitas = await Promise.all(
          data.map(async (hotel) => {
            const imagesResponse = await fetch(`https://tripselbe.fly.dev/hotel-images/${hotel.nama}`);
            const imagesData = await imagesResponse.json();
            const thumbnailImage = imagesData.find((image: { nama: string }) => image.nama === 'thumbnail');

            const fasilitasResponse = await fetch(`https://tripselbe.fly.dev/hotel-fasilitas/${hotel.nama}`);
            const fasilitasData = await fasilitasResponse.json();
            const fasilitasArray = fasilitasData.map((fasilitas: { nama: string }) => fasilitas.nama);

            return {
              ...hotel,
              thumbnailUrl: thumbnailImage ? thumbnailImage.url : undefined,
              fasilitas: fasilitasArray,
            };
          })
        );

        hotelsWithThumbnailsAndFasilitas.sort((a, b) => {
          const jarakA = parseFloat(a.jarak || '0');
          const jarakB = parseFloat(b.jarak || '0');
          return jarakA - jarakB;
        });

        setHotels(hotelsWithThumbnailsAndFasilitas);
      })
      .catch((error) => console.error('Error fetching hotels:', error));
  }, []);

  const handleItemClick = (hotelName: string) => {
    navigate(`/cari-hotel?kesiniyuk=${encodeURIComponent(hotelName)}`);
  };

  return (
    <Stack direction={'column'} height={'auto'} gap={5}>
      {hotels
        .filter((hotel) => selectedStars.length === 0 || selectedStars.includes(Number(hotel.bintang) || 0))
        .filter((hotel) => {
          if (!hotel.harga) {
            return false;
          }
          const [minHarga, maxHarga] = hotel.harga
            .replace('Rp ', '')
            .split('-')
            .map((part) => parseInt(part.replace(/\D/g, ''), 10));

          const min = Number(minimal.replace(/\./g, ''));
          const max = Number(maximal.replace(/\./g, ''));

          return (
            (!minimal || (minHarga >= min && maxHarga >= min)) &&
            (!maximal || (maxHarga <= max && minHarga <= max))
          );
        })
        .filter((hotel) => checkedFasilitas.length === 0 || hotel.fasilitas?.some((fasilitas) => checkedFasilitas.includes(fasilitas)))
        .filter((hotel) => selectedDomisili.length === 0 || selectedDomisili.includes(hotel.domisili || ''))
        .map((hotel, index) => (
          <Stack
            key={index}
            sx={{ 
              width: '100%',
              height: isMobile ? 'auto' : '250px', // Adjust height based on screen size
              borderRadius: '40px 0px',
              boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.25)',
              flexDirection: isMobile ? 'column' : 'row', // Adjust direction for mobile
              cursor: 'pointer',
            }}
            onClick={() => handleItemClick(hotel.nama)}
          >
            <Stack
              sx={{
                width: isMobile ? '100%' : '55%',
                height: isMobile ? '250px' : '100%',
                background: '#04214C',
                borderRadius: isMobile ? '40px 40px 0px 0px' : '40px 0px 0px 0px',
              }}
            >
              <img
                src={hotel.thumbnailUrl}
                alt="Hotel"
                style={{
                  width: '100%',
                  height: isMobile ? '100%' : '100%',
                  objectFit: 'cover',
                  borderRadius: isMobile ? '40px 0px 0px 0px' : '40px 0px 0px 0px',
                }}
              />
            </Stack>
            <Stack
              sx={{
                width: isMobile ? '80%' : '45%',
                padding: isMobile ? '20px' : '20px 20px 20px 40px',
                justifyContent: 'center',
              }}
            >
              <Typography fontSize={isMobile ? '20px' : '24px'} fontWeight={500} mb={1}>
                {hotel.nama.length > 20 ? `${hotel.nama.substring(0, 20)}...` : hotel.nama}
              </Typography>
              <Stack direction="row" gap={1} mb={1}>
                {hotel.bintang &&
                  Array.from({ length: hotel.bintang }).map((_, index) => (
                    <Icon
                      key={index}
                      icon="fluent:star-16-filled"
                      width="35"
                      height="35"
                      style={{ color: '#FF8702' }}
                    />
                  ))}
              </Stack>
              {hotel.lokasi && (
                <Stack alignItems="center" direction="row" mb={1}>
                  <Stack
                    sx={{
                      background: '#FF8702',
                      borderRadius: '20px',
                      padding: '5px 15px',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Icon icon="fluent:location-16-filled" width="25" height="25" style={{ color: '#04214C' }} />
                    <Typography fontWeight={500} fontSize={'20px'} color={'#04214C'}>
                      {hotel.lokasi}
                    </Typography>
                  </Stack>
                </Stack>
              )}
              {hotel.telfon && (
                <Stack direction="row" alignItems="center" mb={1}>
                  <Icon icon="fluent:call-16-filled" width="23" height="23" style={{ color: '#04214C' }} />
                  <Typography fontWeight={500} fontSize={'20px'} color={'#04214C'}>
                    {hotel.telfon}
                  </Typography>
                </Stack>
              )}
              {hotel.jarak && (
                <Stack direction="row" alignItems="center">
                  <Icon icon="solar:route-bold" width="23" height="23" style={{ color: '#04214C' }} />
                  <Typography fontWeight={500} fontSize={'20px'} color={'#04214C'}>
                    {hotel.jarak} km ke {jenis} {hotel.domisili}
                  </Typography>
                </Stack>
              )}
            </Stack>
            <Stack
              sx={{
                width: isMobile ? '80%' : '45%',
                justifyContent: 'center',
                textAlign: isMobile ? 'left' : 'right',
                padding: '20px',
              }}
            >
              <Typography fontSize={'22px'} color={'#FF010C'} fontWeight={500} mb={1}>
                Mulai Dari
              </Typography>
              <Typography fontSize={'24px'} color={'#04214C'} fontWeight={700} mb={1}>
                {parseInt(
                  hotel.harga
                    .replace('Rp ', '')
                    .split('-')[0]
                    .replace(/\D/g, ''),
                  10
                )
                  .toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                  .replace(/\s/g, '')}
              </Typography>
              <Typography fontSize={'12px'} color={'#04214C'} fontWeight={600}>
                Harga spesial untuk T-Flyers
              </Typography>
            </Stack>
          </Stack>
        ))}
    </Stack>
  );
}
