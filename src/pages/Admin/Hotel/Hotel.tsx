import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define the Restoran type
interface Restoran {
  nama: string;
  domisili: string;
  harga: string;
  lokasi: string;
  telfon: string;
  jarak: string;
  alamat: string;
  bintang: string;
}

export default function RestoranPage() {
  const navigate = useNavigate();
  const [restorans, setRestorans] = useState<Restoran[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Restoran[]>('https://tripselbe.fly.dev/hotels');
        setRestorans(response.data);
      } catch (error) {
        console.error('Error fetching data from Restoran table:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (nama: string) => {
    navigate(`/admin/input-hotel`, { state: { nama } });
  };
  const handleAdd = () => {
    navigate(`/admin/add-hotel`);
  };

  const handleDelete = async (nama: string) => {
    try {
      await axios.delete(`https://tripselbe.fly.dev/hotels/${nama}`);
      // Refresh the list of restorans after deletion
      const response = await axios.get<Restoran[]>('https://tripselbe.fly.dev/hotels');
      setRestorans(response.data);
      alert('data telah terhapus');
    } catch (error) {
      console.error('Error deleting data from Restoran table:', error);
    }
  };

  

  return (
    <Stack width="100%" height="900px" sx={{overflowY:'none'}}>
      {/* restoran and create button */}
      <Stack direction={'row'} justifyContent={'space-between'} padding={'0px 30px'}>
        <Typography fontWeight={500} fontSize={'42px'} color={'#04214C'}>
          Hotel
        </Typography>

        <Button 
        onClick={handleAdd}
          disableElevation 
          disableFocusRipple 
          disableRipple 
          disableTouchRipple
          sx={{
            width: 'auto',
            padding: '10px 20px',
            backgroundColor: '#FF010C',
            borderRadius: '40px',
          }}
        >
          <Icon icon='fluent:add-16-filled' width='30' height='30' style={{ color: 'red', backgroundColor: 'white', borderRadius: '50px', padding: '5px' }} />
          <Typography paddingLeft={'15px'} sx={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 500,
          }}>
            Tambah Data
          </Typography>
        </Button>
      </Stack>
      
      <Stack margin={'20px 0 20px 0'} overflow={'auto'} height={'680px'}>
  <Stack sx={{ backgroundColor: '#04214C' }} flexDirection={'column'} margin={'0 20px 0 20px'} width={'calc((372px * 9) + 100px)'} height={'auto'} borderRadius={'30px 30px 0 0'}>
    
    {/* header container with horizontal scroll */}
    <Stack direction={'row'} sx={{ overflowX: 'none' }}>
      <Stack minWidth={'70px'} alignItems={'center'} justifyContent={'center'} padding={'16px'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>No</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Action</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Nama</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Domisili</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Harga</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Kecamatan/Kelurahan</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Telfon</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Jarak ke TSO</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Alamat</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Bintang</Typography>
      </Stack>
    </Stack>
    
    {/* rows container with vertical scroll */}
    <Stack direction={'column'} height={'590px'} sx={{ backgroundColor: '#FFF', overflowY: 'auto', overflowX:'hidden' }}>
    {restorans.map((restoran, index) => (
    <Stack 
      direction={'row'} 
      borderRight={'2px solid #04214C'} 
      borderTop={'none'} 
      borderLeft={'2px solid #04214C'}
      borderBottom={'2px solid #04214C'}
      key={restoran.nama}
      sx={{
        '&:hover': {
          backgroundColor: '#f0f0f0',
        },
      }}
    >
      <Stack minWidth={'68.4px'} alignItems={'center'} justifyContent={'center'} padding={'16px'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>{index + 1}</Typography>
      </Stack>
      <Stack borderRight={'2px solid #04214C'}>
        <Stack direction={'row'} height={'100px'} alignItems={'center'} justifyContent={'center'} width={'372px'} gap={1}>
          <Button 
            disableElevation 
            disableFocusRipple 
            disableRipple 
            disableTouchRipple
            onClick={() => handleEdit(restoran.nama)}
            sx={{
              color: 'white',
              fontSize: '26px',
              fontWeight: 500,
              backgroundColor: '#00990F',
              padding: '10px 25px',
              borderRadius: '40px',
              minWidth: 'auto',
              height: 'auto',
              transition: 'color 0.4s ease-in-out',
            }}
          >
            <Icon icon="clarity:edit-solid" width="30" height="30" style={{ color: 'inherit', paddingRight: '10px' }} />
            Edit
          </Button>
          <Button 
            disableElevation 
            disableFocusRipple 
            disableRipple 
            disableTouchRipple
            onClick={() => handleDelete(restoran.nama)}
            sx={{
              color: 'white',
              fontSize: '26px',
              fontWeight: 500,
              backgroundColor: '#FF010C',
              padding: '10px 25px',
              borderRadius: '40px',
              minWidth: 'auto',
              height: 'auto',
              transition: 'color 0.4s ease-in-out',
            }}
          >
            <Icon icon="ic:round-delete" width="30" height="30" style={{ color: 'inherit', paddingRight: '10px' }} />
            Delete
          </Button>
        </Stack>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.nama && (restoran.nama.length > 22 ? restoran.nama.slice(0, 22) + '...' : restoran.nama)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.domisili && (restoran.domisili.length > 22 ? restoran.domisili.slice(0, 22) + '...' : restoran.domisili)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.harga && (restoran.harga.length > 22 ? restoran.harga.slice(0, 22) + '...' : restoran.harga)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.lokasi && (restoran.lokasi.length > 22 ? restoran.lokasi.slice(0, 22) + '...' : restoran.lokasi)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.telfon && (restoran.telfon.length > 22 ? restoran.telfon.slice(0, 22) + '...' : restoran.telfon)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.jarak && (restoran.jarak.length > 22 ? restoran.jarak.slice(0, 22) + '...' : `${restoran.jarak} km`)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.alamat && (restoran.alamat.length > 22 ? restoran.alamat.slice(0, 22) + '...' : restoran.alamat)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.bintang && (restoran.bintang.length > 22 ? restoran.bintang.slice(0, 22) + '...' : restoran.bintang)}
        </Typography>
      </Stack>
    </Stack>
  ))}
    </Stack>
  </Stack>
</Stack>


    </Stack>
  );
}
