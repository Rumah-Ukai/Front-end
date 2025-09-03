import { Stack } from '@mui/material';
import { useRef, useState } from 'react';
import Orangewithimage1 from './soal';
import left from '../../assets/arrowleft.svg';
import right from '../../assets/arrowright.svg';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

interface OrangewithimageProps {
  orangeData: { imageSrc: string; textContent: string }[];
}

export default function Orangewithimage({ orangeData }: OrangewithimageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  const startScrollLeft = () => {
    stopScroll(); // Clear any existing interval before starting a new one
    setScrollInterval(setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft -= 5; // Adjust scrolling speed as needed
      }
    }, 10)); // Adjust scrolling interval as needed
  };

  const startScrollRight = () => {
    stopScroll(); // Clear any existing interval before starting a new one
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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsMouseDown(true);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMouseDown || !containerRef.current) return;
    const x = e.touches[0].pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsMouseDown(false);
  };

  const handleItemClick = (textContent: string) => {
    navigate(`/wisata-${textContent}`); // Navigate to the specified route
  };

  return (
    <Stack
      style={{ overflowX: 'auto' }}
      alignItems={'center'}
      justifyContent={'center'}
      direction={'row'}
      onMouseUp={stopScroll}
      onTouchEnd={stopScroll}
    >
      <Stack
        onMouseDown={startScrollLeft}
        onTouchStart={startScrollLeft}
        onMouseUp={stopScroll}
        onTouchEnd={stopScroll}
        width={{ xs: '60px', md: '90px' }}
        marginRight={'-25px'}
        zIndex={1}
      >
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
          width: '1168px'
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {orangeData.map((item, index) => (
          <Stack key={index} onClick={() => handleItemClick(item.textContent)}>
            <Orangewithimage1 imageSrc={item.imageSrc} textContent={item.textContent} />
          </Stack>
        ))}
      </Stack>
      <Stack
        onMouseDown={startScrollRight}
        onTouchStart={startScrollRight}
        onMouseUp={stopScroll}
        onTouchEnd={stopScroll}
        width={{ xs: '60px', md: '90px' }}
        marginLeft={'-25px'}
        zIndex={1}
      >
        <img src={right} alt="right" />
      </Stack>
    </Stack>
  );
}
