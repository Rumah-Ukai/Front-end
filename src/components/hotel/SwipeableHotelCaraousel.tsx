import { useState, useEffect, useCallback } from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Stack, IconButton } from '@mui/material';
import { Icon } from '@iconify/react/dist/iconify.js';

interface HotelImage {
    nama: string;
    url: string;
}

function SwipeableHotelCarousel() {
    const [hotelImages, setHotelImages] = useState<HotelImage[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchHotelImages = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const textContent = searchParams.get('kesiniyuk');
            if (!textContent) {
                throw new Error('Text content not found in query parameters');
            }
            try {
                const response = await fetch(`https://tripselbe.fly.dev/hotel-images/${encodeURIComponent(textContent)}`);
                const data = await response.json();
                setHotelImages(data);
            } catch (error) {
                console.error('Error fetching hotel images:', error);
            }
        };

        fetchHotelImages();
    }, []);

    const handlePreviousSlide = () => {
        deactivateAutoplay();
        setActiveIndex((prevIndex) => (prevIndex === 0 ? hotelImages.length - 1 : prevIndex - 1));
    };

    const handleNextSlide = () => {
        deactivateAutoplay();
        setActiveIndex((prevIndex) => (prevIndex === hotelImages.length - 1 ? 0 : prevIndex + 1));
    };

    const deactivateAutoplay = useCallback(() => {
        if (autoplayInterval !== null) {
            clearInterval(autoplayInterval);
            setAutoplayInterval(null);
        }
    }, [autoplayInterval]);

    useEffect(() => {
        if (hotelImages.length > 0) {
            const interval = setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex === hotelImages.length - 1 ? 0 : prevIndex + 1));
            }, 5000); // Change the interval time here (5000ms = 5 seconds)
            
            setAutoplayInterval(interval);
    
            return () => {
                clearInterval(interval);
            };
        }
    }, [hotelImages]);

    useEffect(() => {
        // Check if the active index is the last slide, and reset to the first slide
        if (activeIndex === hotelImages.length - 1) {
            const timeout = setTimeout(() => {
                setActiveIndex(0);
            }, 3000); // Delay the reset to ensure smooth transition
            return () => clearTimeout(timeout);
        }
    }, [activeIndex, hotelImages]);

    return (
        <Stack width={'100%'} position="relative">
            <CarouselProvider
                naturalSlideWidth={1440}
                naturalSlideHeight={511}
                totalSlides={hotelImages.length}
                visibleSlides={1}
                currentSlide={activeIndex}
            >
                <CarouselContent hotelImages={hotelImages} />
                <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    position="absolute"
                    left={0}
                    right={0}
                    bottom={'50%'}
                    zIndex={1} // Ensure the buttons are above the slides
                >
                    <IconButton onClick={handlePreviousSlide}>
                        <Icon icon="ic:round-navigate-next" width="50" height="50" style={{ color: '#FFF', transform: 'rotate(180deg)' }}/>
                    </IconButton>
                    <IconButton onClick={handleNextSlide}>
                        <Icon icon="ic:round-navigate-next" width="50" height="50" style={{ color: '#FFF' }} />
                    </IconButton>
                </Stack>
            </CarouselProvider>
        </Stack>
    );
}

interface CarouselContentProps {
    hotelImages: HotelImage[];
}

function CarouselContent({ hotelImages }: CarouselContentProps) {
    return (
        <Stack>
            <Slider>
                {hotelImages.map((image, index) => (
                    <Slide index={index} key={index}>
                        <Stack
  maxHeight={'511px'}
  key={index}
  direction={'row'}
  justifyContent={'center'}
  alignItems={'center'}
  sx={{
    backgroundImage: `url(${image.url})`, // Set image as background
    backgroundSize: 'cover', // Cover the entire Stack area
    backgroundPosition: 'center', // Center the background image
    width: '100%', // Ensure the Stack fills its container width
    height: '511px', // Set the fixed height
  }}
/>
                    </Slide>
                ))}
            </Slider>
        </Stack>
    );
}

export default SwipeableHotelCarousel;
