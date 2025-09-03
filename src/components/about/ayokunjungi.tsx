import { Stack, Typography } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import Orangewithimage1 from '../beranda/soal';
import left from '../../assets/about/arrow_left_blue.png';
import right from '../../assets/about/arrow_right_blue.png';
import { useNavigate } from 'react-router-dom';

interface OrangeDataItem {
  gambar_url1: string;
  gambar_url2: string;
  gambar_url3: string;
  nama: string;
  domisili: string;
}

interface OrangewithimageProps {
  domisili: string;
}

export default function Orangewithimage({ domisili }: OrangewithimageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [orangeData, setOrangeData] = useState<OrangeDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://tripselbe.fly.dev/wisata`);
        if (!response.ok) {
          console.error('Error fetching data:', response.statusText);
          setLoading(false);
          return;
        }
        const data: OrangeDataItem[] = await response.json();
        const filteredData = data.filter(item => item.domisili.toLowerCase() === domisili.toLowerCase());
        setOrangeData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [domisili]);

  const startScrollLeft = () => {
    setScrollInterval(setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft -= 5; // Adjust scrolling speed as needed
      }
    }, 10)); // Adjust scrolling interval as needed
  };

  const startScrollRight = () => {
    setScrollInterval(setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft += 5; // Adjust scrolling speed as needed
      }
    }, 10)); // Adjust scrolling interval as needed
  };

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

  const handleItemClick = (textcontent: string) => {
    navigate(`/cari-wisata?kesiniyuk=${encodeURIComponent(textcontent)}`);
  };

  if (loading) {
    return (
      <Stack
        style={{ overflowX: 'auto' }}
        alignItems={'center'}
        justifyContent={'center'}
        direction={'row'}
        onMouseUp={stopScroll}
      >
        <Stack onMouseDown={startScrollLeft} width={'90px'} marginRight={'-25px'} zIndex={1}>
          <img src={left} alt="left" />
        </Stack>
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
          {[...Array(3)].map((_, index) => (
            <Stack key={index} className='loading' sx={{ backgroundColor: 'lightgray', width: '335px', height: '400px', borderRadius: '40px 0px' }}>
            </Stack>
          ))}
        </Stack>
        <Stack onMouseDown={startScrollRight} width={'90px'} marginLeft={'-25px'} zIndex={1}>
          <img src={right} alt="right" />
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack>
      {orangeData.length > 0 && (
       <Typography sx={{
            fontWeight: 700,
            color: '#ff010c',
            fontSize: '60px',
            paddingTop: '50px',
            paddingBottom: '30px',
            textAlign: 'center'
          }}>
            Ayo Kunjungi
          </Typography>
          )}
    <Stack
      style={{ overflowX: 'clip' }}
      alignItems={'center'}
      justifyContent={'center'}
      direction={'row'}
      onMouseUp={stopScroll}
    >
      <Stack width={'250px'} height={'400px'} sx={{background:'linear-gradient(90deg, white 0%, transparent 100%)'}} position={'absolute'} left={'0px'}>
      </Stack>
      {orangeData.length > 0 && (

      <Stack onMouseDown={startScrollLeft} width={'0px'} position={'absolute'} left={'75px'} zIndex={1}>
        <img src={left} width={'90px'} alt="left" />
      </Stack>
          )}

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
        paddingLeft={'135px'}
      >
   
        {orangeData.map((item, index) => (
          <Stack key={index} onClick={() => handleItemClick(item.nama)}> 
            <Orangewithimage1 imageSrc={item.gambar_url1||item.gambar_url2||item.gambar_url3} textContent={item.nama} fontsize='30px' />
          </Stack>
        ))}
      </Stack>
      {orangeData.length > 0 && (

      <Stack onMouseDown={startScrollRight} width={'0px'} position={'absolute'}  right={'201px'} zIndex={1}>
        <img src={right} alt="right" width={'90px'}/>
      </Stack>
      )}

      <Stack width={'250px'} height={'400px'} sx={{background:'linear-gradient(90deg, transparent 0%, white 100%)'}} position={'absolute'} right={'0px'}>
      </Stack>
    </Stack>
    </Stack>

  );
}
