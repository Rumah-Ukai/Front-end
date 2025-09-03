import { Typography, Card, Stack, useTheme, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

interface OrangewithimageProps {
  imageSrc: string;
  textContent: string;
  location: string;
  width?: string;
  fontsize?: string;
  imgheight?: string;
  domisili: string;
}

interface Area {
  domisili: string;
  jenis: string;
}

const Orangewithimage: React.FC<OrangewithimageProps> = ({
  imageSrc,
  domisili,
  textContent,
  location,
  width = '335px',
  fontsize = '50px',
  imgheight = '80px'
}) => {
  const [jenis, setJenis] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const calculateHeight = () => {
    if (isMobile) {
      return '350px'; // Adjust the height for mobile view
    } else {
      return '600px'; // Default height for larger screens
    }
  };

  useEffect(() => {
    const fetchJenis = async () => {
      try {
        const areaResponse = await fetch(`https://tripselbe.fly.dev/area/${domisili}`);
        if (!areaResponse.ok) {
          throw new Error('Failed to fetch area data');
        }
        const areaData: Area = await areaResponse.json();
        setJenis(areaData.jenis);
      } catch (error) {
        console.error('Error fetching jenis:', error);
      }
    };

    fetchJenis();
  }, [domisili]);

  return (
    <Card
      sx={{
        width: { xs: '300px', md: width },
        height: calculateHeight(), // Dynamic height based on screen size
        background: 'linear-gradient(65deg, #FF0025 23.51%, #F9A12D 81.92%)',
        borderRadius: '0px 104px 40px 0px',
      }}
    >
      <Stack width={width} height={`calc(${calculateHeight()} - ${isMobile ? '70px' : imgheight })`} sx={{}}>
        <Stack
          width={'100%'}
          height={'100%'}
          sx={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover', // Ensures the image covers the entire area
            backgroundPosition: 'center center', // Centers the image both horizontally and vertically
            justifyContent: 'flex-end',
            borderBottomLeftRadius: '100px',
            overflow: 'auto',
          }}
        >
          <Stack width={'100%'} height={'101px'} sx={{
            background: 'linear-gradient(90deg, #04214C 25.42%, rgba(4, 33, 76, 0.00) 100%)',
            justifyContent: 'center',
          }}>
            <Typography color={'white'} fontSize={isMobile ? '18px' : '32px' } fontWeight={500} paddingLeft={isMobile ? '25px' : '53px' }>{location} km dari {jenis} {domisili}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack width={'100%'} justifyContent={'center'} alignItems={'center'}>
        <Stack width={'100%'} height={isMobile ? '70px' : imgheight } justifyContent={'center'} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Typography sx={{ textAlign: 'center', fontSize: isMobile ? '22px' : fontsize }} fontWeight={500} color={'white'}>
            {textContent.length >= 22 ? `${textContent.slice(0, 22)}...` : textContent}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

Orangewithimage.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  textContent: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  domisili: PropTypes.string.isRequired,
  width: PropTypes.string,
};

export default Orangewithimage;
