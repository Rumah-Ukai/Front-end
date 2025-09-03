import { useEffect, useRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';

interface Kamar {
  nama: string;
  hotel_nama: string;
  gambar_url: string;
}


export default function DragableFasilitas() {
  const [kamars, setKamars] = useState<Kamar[]>([]); // Initialize as an empty array
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const textContent = searchParams.get('kesiniyuk');
      if (!textContent) {
        throw new Error('Text content not found in query parameters');
      }
      const fetchData = async () => {
        const response = await fetch(`https://tripselbe.fly.dev/kamar/${encodeURIComponent(textContent)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch kamar data');
        }
        const data = await response.json();
        setKamars(data); 
        console.log([data])
      };

      fetchData();
    } catch (error) {
      console.error('Error fetching kamar data:', error);
    }
  }, []);
  

  const stopScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseDown(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <Stack direction={'row'} onMouseUp={stopScroll}>

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
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {kamars.map((kamar, index) => (
          <Stack key={index}>
            <Stack sx={{
              width: '580px', height: '325px',
              backgroundImage: `linear-gradient(180deg, transparent 56.5%, #04214C 100%), url('${kamar.gambar_url}')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              borderRadius: '50px 0px'
            }}>
              <Typography fontSize={'32px'} fontWeight={500} color={'white'} sx={{ marginTop: 33, marginLeft: 3 }}>
                {kamar.nama}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>

    </Stack>
  );
}
