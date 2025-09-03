import { useEffect, useState } from 'react';
import { Grid, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import Item from './orangewithimage';

interface OrangewithimageProps {
  imageSrc: string;
  textContent: string;
  domisili: string
  jarak: string
}

interface GridProps {
  backendLink?: string;
  Data?: OrangewithimageProps[];
}

export default function GridOrange({ backendLink, Data }: GridProps) {
  const [GridData, setGridData] = useState<OrangewithimageProps[]>([]);
  const navigate = useNavigate(); // Initialize useHistory

  useEffect(() => {
    const fetchData = async () => {
      if (Data) {
        setAndSortGridData(Data);
      } else if (backendLink) {
        try {
          const response = await fetch(backendLink);
          const data: OrangewithimageProps[] = await response.json();
          setAndSortGridData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [backendLink, Data]);

  const setAndSortGridData = (data: OrangewithimageProps[]) => {
    // Sort the data based on the jarak property parsed as a number
    const sortedData = data.sort((a, b) => parseFloat(a.jarak) - parseFloat(b.jarak));
    setGridData(sortedData);
  };
  // Function to handle click event
  const handleItemClick = (textContent: string) => {
    // Use useHistory to navigate to the specified path
   navigate(`/cari-oleh-oleh?kesiniyuk=${encodeURIComponent(textContent)}`);
  };

  return (
    <Grid container rowSpacing={3} columnSpacing={3} justifyContent={GridData.length % 2 === 0 ? 'start' : 'start'} paddingLeft={{xs: '40px', md: '125px'}} >      {GridData.map((orangedata, index) => (
        <Grid item key={index} alignItems='center' justifyContent='center'>
          {/* Wrap the Item component inside a div and attach an onClick event */}
          <Stack style={{ cursor: 'pointer' }} onClick={() => handleItemClick(orangedata.textContent)}>
            <Item imageSrc={orangedata.imageSrc} domisili={orangedata.domisili} location={orangedata.jarak} textContent={orangedata.textContent} width='579px' fontsize='42px' imgheight='90px' />
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}
