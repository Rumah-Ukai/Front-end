import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Item from '../../components/restoran/orangewithimage';

interface OrangewithimageProps {
  imageSrc: string;
  textContent: string;
  location: string;
  domisili: string;
}

interface GridProps {
  backendLink?: string;
  Data?: OrangewithimageProps[];
}

export default function GridOrange({ backendLink, Data }: GridProps) {
  const [GridData, setGridData] = useState<OrangewithimageProps[]>([]);
  const navigate = useNavigate();

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
    // Sort the data based on the location property parsed as a number
    const sortedData = data.sort((a, b) => parseFloat(a.location) - parseFloat(b.location));
    setGridData(sortedData);
  };
  const handleItemClick = (textContent: string) => {
    navigate(`/cari-restoran?kesiniyuk=${encodeURIComponent(textContent)}`);
  };

  return (
    <Grid container rowSpacing={3} columnSpacing={3} justifyContent={GridData.length % 2 === 0 ? 'start' : 'start'} paddingLeft={ {xs: '40px', md: '125px'} }>
      {GridData.map((orangedata, index) => (
        <Grid item key={index} >
          <div style={{ cursor: 'pointer' }} onClick={() => handleItemClick(orangedata.textContent)}>
            <Item imageSrc={orangedata.imageSrc} domisili={orangedata.domisili} location={orangedata.location} textContent={orangedata.textContent} width='579px' fontsize='42px' imgheight='131px' />
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
