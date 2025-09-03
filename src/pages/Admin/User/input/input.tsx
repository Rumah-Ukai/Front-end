import { useState, useEffect } from 'react';
import { Stack, Typography, Input, MenuItem, Select as MuiSelect, TextField, CircularProgress } from '@mui/material';
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
const customInputStyle = {
  width: '100%',
  height: '53px',
  '& input': {
    borderRadius: '20px',
    height: '53px',
    border: '2px solid #04214C',
    outline: 'none',
    padding: '0px 10px',
    fontWeight:500,
  },
  '& .MuiInputLabel-root': {
    color: '#6E6C6C',
    '&.Mui-focused': {
      color: 'transparent',
    },
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    '&:hover fieldset': {
      borderColor: 'red',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#04214C',
    },
  },
  '& .MuiOutlinedInput-root.MuiSelect-root': {
    borderRadius: '20px',
    '&:hover fieldset': {
      borderColor: '#04214C',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#04214C',
    },
  },
};
const customInputStyle2 = {
  width: '100%',
  height: 'auto',
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    '& fieldset': {
      borderColor: '#04214C', // Apply border color here
      border: '2px solid #04214C', 
    },
    '&:hover fieldset': {
      borderColor: '#04214C',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#04214C',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#04214C',
    '&.Mui-focused': {
      color: 'transparent',
    },
  },
  '& .MuiInputBase-input': {
    fontWeight: 500, // Change font weight here
    color:'#04214C',
    fontSize: '22px', // Change font size here
    
  },
};

export default function Register() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    nik: '',
    phone_number: '',
    domisili: '',
    jenis_kelamin: '',
    password: '',
    status: '',
  });

  useEffect(() => {
    const fetchRestoranData = async () => {
      const { email } = location.state;
  
      try {
        const response = await fetch(`https://tripselbe.fly.dev/user/${email}`);
        const restoranData = await response.json();
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}: ${restoranData.error}`);
        }

        setFormData({
          full_name: restoranData.full_name || '',
          email: restoranData.email || '',
          nik: restoranData.nik || '',
          phone_number: restoranData.phone_number || '',
          domisili: restoranData.domisili || '',
          jenis_kelamin: restoranData.jenis_kelamin || '',
          password: restoranData.password || '',
          status: restoranData.status || '',
        });
      } catch (error) {
        console.error('Error fetching restoran data:', error);
      }
    };
    fetchRestoranData();
  }, [location]);
  
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to false when submission is complete

    try {
      const response = await fetch('https://tripselbe.fly.dev/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Server responded with status ${response.status}: ${errorMessage}`);
      }
  
      const data = await response.json();
      console.log(formData)
      alert(data.message);
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Failed to update user: ${error}`);
    }finally {
      setLoading(false); // Set loading to false when submission is complete
    }
  };
  

  return (
    <Stack height="900px" sx={{overflowY:'none'}} padding={'0 30px'} overflow={'auto'}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Stack sx={{ width: 'auto' }} spacing={10} >
          <Typography fontWeight={500} fontSize={'42px'} color={'#04214C'}>
          Tambah Data User
        </Typography>
          <Stack spacing={2} maxWidth={'100%'}>
            <Stack direction={'row'} gap={2}>
              <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                Nama User
                </Typography>
                <Input
                  disableUnderline
                  placeholder="Nama Lengkap"
                  style={{ fontSize: '22px', color: '#04214C' }}
                  sx={customInputStyle}
                  inputProps={{
                    'aria-label': 'Nama Lengkap',
                    name: 'fullName',
                    value: formData.full_name,
                    onChange: (e) => setFormData({ ...formData, full_name: (e.target as HTMLInputElement).value }),
                  }}
                />

                <Stack direction={'row'} justifyContent={'space-between'} gap={2}>
                <Stack maxWidth={'50%'} width={'50%'}>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Domisili
                </Typography>
                <MuiSelect
                  displayEmpty
                  inputProps={{ 'aria-label': 'Domisili' }}
                  style={{ borderRadius: '20px', fontSize: '22px', color: '#04214C', border: '2px solid #04214C', }}
                  sx={{
                    ...customInputStyle,
                    '&:focus': {
                      borderColor: 'transparent !important',
                    },
                    '& fieldset': {
                      borderColor: 'transparent !important',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent !important',
                    },
                    '&:active fieldset': {
                      borderColor: 'transparent !important',
                    },
                  }}
                  name="domisili"
                  value={formData.domisili}
                  onChange={(e) => setFormData({ ...formData, domisili: e.target.value })}
                >
                  <MenuItem value={formData.domisili}>
                    <em>{formData.domisili}</em>
                  </MenuItem>
                  <MenuItem value='Bali'>Bali</MenuItem>
                  <MenuItem value='Kupang'>Kupang</MenuItem>
                  <MenuItem value='Mataram'>Mataram</MenuItem>
                  <MenuItem value='Flores'>Flores</MenuItem>
                </MuiSelect>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                Nomor Telfon
                </Typography>
                <Input
                  disableUnderline
                  placeholder="Nomor Telfon"
                  style={{ fontSize: '22px', color: '#04214C' }}
                  sx={customInputStyle}
                  inputProps={{
                    'aria-label': 'phoneNumber',
                    name: 'phoneNumber',
                    value: formData.phone_number,
                    onChange: (e) => setFormData({ ...formData, phone_number: (e.target as HTMLInputElement).value }),
                  }}
                />
                </Stack>
                <Stack maxWidth={'50%'} width={'50%'}>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Jenis Kelamin
                </Typography>
                <MuiSelect
                  displayEmpty
                  inputProps={{ 'aria-label': 'JK' }}
                  style={{ borderRadius: '20px', fontSize: '22px', color: '#04214C', border: '2px solid #04214C', }}
                  sx={{
                    ...customInputStyle,
                    '&:focus': {
                      borderColor: 'transparent !important',
                    },
                    '& fieldset': {
                      borderColor: 'transparent !important',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent !important',
                    },
                    '&:active fieldset': {
                      borderColor: 'transparent !important',
                    },
                  }}
                  name="JK"
                  value={formData.jenis_kelamin}
                  onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                >
                  <MenuItem value={formData.jenis_kelamin}>
                    <em>{formData.jenis_kelamin}</em>
                  </MenuItem>
                  <MenuItem value='Pria'>Pria</MenuItem>
                  <MenuItem value='Perempuan'>Perempuan</MenuItem>
                </MuiSelect>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                NIK
                </Typography>
                <Input
                  disableUnderline
                  placeholder="NIK"
                  style={{ fontSize: '22px', color: '#04214C' }}
                  sx={customInputStyle}
                  inputProps={{
                    'aria-label': 'Jarak',
                    name: 'fullName',
                    value: formData.nik,
                    onChange: (e) => setFormData({ ...formData, nik: (e.target as HTMLInputElement).value }),
                  }}
                />
                </Stack>
                </Stack>

              </Stack>
              <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                Email
                </Typography>
                <TextField
                multiline
                  variant='outlined'
                  placeholder="Email"
                  sx={customInputStyle2}
                  inputProps={{
                    'aria-label': 'Email',
                    name: 'deskripsi',
                    value: formData.email,
                    onChange: (e) => setFormData({ ...formData, email: (e.target as HTMLInputElement).value }),
                  }}
                />
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                Password
                </Typography>
                <TextField
                multiline
                  variant='outlined'
                  placeholder="Password"
                  sx={customInputStyle2}
                  inputProps={{
                    'aria-label': 'Password',
                    name: 'password',
                    value: formData.password,
                    onChange: (e) => setFormData({ ...formData, password: (e.target as HTMLInputElement).value }),
                  }}
                />
                <Stack>

                </Stack>
                <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
                </Stack>
                <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Status
                </Typography>
                <MuiSelect
                  displayEmpty
                  inputProps={{ 'aria-label': 'Domisili' }}
                  style={{ borderRadius: '20px', fontSize: '22px', color: '#04214C', border: '2px solid #04214C', }}
                  sx={{
                    ...customInputStyle,
                    '&:focus': {
                      borderColor: 'transparent !important',
                    },
                    '& fieldset': {
                      borderColor: 'transparent !important',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent !important',
                    },
                    '&:active fieldset': {
                      borderColor: 'transparent !important',
                    },
                  }}
                  name="domisili"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value={formData.status}>
                    <em>{formData.status}</em>
                  </MenuItem>
                  <MenuItem value='Guest'>Guest</MenuItem>
                  <MenuItem value='User'>User</MenuItem>
                  <MenuItem value='Admin'>Admin</MenuItem>
                </MuiSelect>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing={3} alignItems={'center'} justifyContent={'center'} width={'100%'} direction={'row'} height={'120px'}>
          {loading ? (
              <CircularProgress />
            ) : (
            <Button
              type="submit"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px',
                width: 'auto',
                fontWeight: 'bold',
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#FF010C',
                borderRadius: '40px',
                paddingLeft: '60px',
                paddingRight: '60px',
                '&:active': {
                  backgroundColor: '#FF010C',
                },
                '&:focus': {
                  backgroundColor: '#FF010C',
                },
                '&:hover': { background: 'white', color: 'red', boxShadow: '0px 0px 0px 2px red', }
              }}
            >
              Simpan Perubahan
            </Button>
            )}
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
}
