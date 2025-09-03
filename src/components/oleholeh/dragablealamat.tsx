import { useRef, useState, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import '../../pages/Oleh/Oleh.css'

interface Location {
  name: string;
  imageUrl: string;
  jarak: string;
}

export default function DragableAlamat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [addresses, setAddresses] = useState<Location[] | null>(null);
  const kesiniyuk = new URLSearchParams(location.search).get('kesiniyuk');

  // Variables to handle dragging
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://tripselbe.fly.dev/addresses/${kesiniyuk}`);
        if (!response.ok) {
          console.error('Error fetching data:', response.statusText);
          // setLoading(false);
          return;
        }
        const data: { nama: string, gambar_url: string, jarak:string }[] = await response.json();
        if (data.length === 0) {
          // Handle the case where no data is returned
          console.log('No data found');
          // setLoading(false);
          return;
        }
        const updatedAddresses: Location[] = data.map(item => ({
          name: item.nama,
          imageUrl: item.gambar_url,
          jarak: item.jarak,
        }));
        setAddresses(updatedAddresses);
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // setLoading(false);
      }
    };
  
    fetchData();
  },  [kesiniyuk]);

  // Handle mouse down event for starting drag
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLImageElement) {
      // Prevent dragging if the clicked element is an image
      return;
    }
    isDragging = true;
    startX = event.pageX - containerRef.current!.offsetLeft;
    scrollLeft = containerRef.current!.scrollLeft;
    // Prevent selection of text during drag
    event.preventDefault();
  };

  // Handle mouse move event for dragging
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const x = event.pageX - containerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  // Handle mouse up event for stopping drag
  const handleMouseUp = () => {
    isDragging = false;
  };

  // if (loading || addresses === null) {
  //   // Display loading text or gray background items while data is being fetched or if addresses is null
  //   return (
  //     <Stack direction="row">
  //        <Stack
  //       ref={containerRef}
  //       direction="row"
  //       spacing={3}
  //       sx={{
  //         '&::-webkit-scrollbar': {
  //           display: 'none'
  //         },
  //         '-ms-overflow-style': 'none',
  //         scrollbarWidth: 'none',
  //         overflowX: 'auto',
  //         maxWidth: '100%',
  //         width: '100%'
  //       }}
  //       onMouseDown={handleMouseDown}
  //       onMouseMove={handleMouseMove}
  //       onMouseUp={handleMouseUp}
  //     >
  //         {[...Array(2)].map((_, index) => (
  //           <Stack key={index} className='loading' sx={{ backgroundColor: 'lightgray', width: '570px', height: '300px', borderRadius: '40px 0px' }}>
              
  //           </Stack>
  //         ))}
  //       </Stack>
  //     </Stack>
  //   );
  // }

  return (
    <Stack direction="row">
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {addresses?.map((address, index) => (
          <Stack key={index}>
          <Stack sx={{
            width: '580px', height: '325px',
            backgroundImage: `linear-gradient(180deg, transparent 56.5%, #04214C 100%), url('${address.imageUrl}')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            borderRadius: '50px 0px'
          }}>
            <Typography fontSize={'32px'} fontWeight={500} color={'white'} sx={{ marginTop: 33, marginLeft: 3 }}>
              {address.jarak} km dari TSO Renon, Bali
            </Typography>
          </Stack>
          <Typography fontSize={'28px'} fontWeight={600} color={'#04214C'}>
              {address.name}
            </Typography>
        </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
