import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define the Restoran type
interface Restoran {
  full_name: string;
  email: string;
  nik: string;
  phone_number: string;
  domisili: string;
  jenis_kelamin: string;
  password: string;
  status: string;
}

export default function RestoranPage() {
  const navigate = useNavigate();
  const [restorans, setRestorans] = useState<Restoran[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Restoran[]>('https://tripselbe.fly.dev/');
        setRestorans(response.data);
      } catch (error) {
        console.error('Error fetching data from Wisata table:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (email: string) => {
    navigate(`/admin/input-user`, { state: { email } });
  };
  const handleAdd = () => {
    navigate(`/admin/add-user`);
  };

  const handleDelete = async (email: string) => {
    try {
      await axios.delete(`https://tripselbe.fly.dev/user/${email}`);
      // Refresh the list of restorans after deletion
      const response = await axios.get<Restoran[]>('https://tripselbe.fly.dev/');
      setRestorans(response.data);
      alert('data telah terhapus');
    } catch (error) {
      console.error('Error deleting data from Wisata table:', error);
    }
  };

  return (
    <Stack width="100%" height="900px" sx={{overflowY:'none'}}>
      {/* restoran and create button */}
      <Stack direction={'row'} justifyContent={'space-between'} padding={'0px 30px'}>
        <Typography fontWeight={500} fontSize={'42px'} color={'#04214C'}>
          User
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
  <Stack sx={{ backgroundColor: '#04214C' }} flexDirection={'column'} margin={'0 20px 0 20px'} width={'calc((372px * 8) + 100px)'} height={'auto'} borderRadius={'30px 30px 0 0'}>
    
    {/* header container with horizontal scroll */}
    <Stack direction={'row'} sx={{ overflowX: 'none' }}>
      <Stack minWidth={'70px'} alignItems={'center'} justifyContent={'center'} padding={'16px'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>No</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Action</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Nama lengkap</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>email</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>NIK</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Nomor Telfon</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>Domisili</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>password</Typography>
      </Stack>
      <Stack minWidth={'372px'} alignItems={'center'} justifyContent={'center'}>
        <Typography fontSize={'26px'} color={'#FFF'} fontWeight={500}>status</Typography>
      </Stack>
    </Stack>
    
    {/* rows container with vertical scroll */}
    <Stack direction={'column'} height={'590px'} sx={{ backgroundColor: '#FFF', overflowY: 'auto', overflowX:'hidden' }}>
    {restorans.map((restoran, index) => (
    <Stack 
      direction={'row'} 
      borderRight={'none'} 
      borderTop={'none'} 
      borderBottom={'2px solid #04214C'}
      borderLeft={'2px solid #04214C'}
      key={restoran.email}
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
            onClick={() => handleEdit(restoran.email)}
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
            onClick={() => handleDelete(restoran.email)}
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
          {restoran.full_name && (restoran.full_name.length > 22 ? restoran.full_name.slice(0, 22) + '...' : restoran.full_name)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.email && (restoran.email.length > 22 ? restoran.email.slice(0, 22) + '...' : restoran.email)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.nik && (restoran.nik.length > 22 ? restoran.nik.slice(0, 22) + '...' : restoran.nik)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.phone_number && (restoran.phone_number.length > 22 ? restoran.phone_number.slice(0, 22) + '...' : restoran.phone_number)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.domisili && (restoran.domisili.length > 22 ? restoran.domisili.slice(0, 22) + '...' : restoran.domisili)}
        </Typography>
      </Stack>
      {/* <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.alamat_gbr && (restoran.alamat_gbr.length > 22 ? restoran.alamat_gbr.slice(0, 22) + '...' : restoran.alamat_gbr)}
        </Typography>
      </Stack> */}
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.password && (restoran.password.length > 22 ? restoran.password.slice(0, 22) + '...' : restoran.password)}
        </Typography>
      </Stack>
      <Stack minWidth={'370.4px'} alignItems={'center'} justifyContent={'center'} borderRight={'2px solid #04214C'}>
        <Typography fontSize={'26px'} color={'#04214C'} fontWeight={500}>
          {restoran.status && (restoran.status.length > 22 ? restoran.status.slice(0, 22) + '...' : restoran.status)}
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
