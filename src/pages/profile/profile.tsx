import { useState, useEffect } from 'react';
import { Stack, Typography, Input, MenuItem, Select as MuiSelect } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const customInputStyle = {
  width: '100%',
  height: '53px',
  '& input': {
    borderRadius: '20px',
    height: '53px',
    border: '1px solid #04214C',
    outline: 'none',
    padding: '0px 10px'
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

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nik: '',
    phoneNumber: '',
    domisili: '',
    jenisKelamin: ''
  });
  const [submitPressed, setSubmitPressed] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
  
      if (token) {
        try {
          const response = await fetch('https://tripselbe.fly.dev/user', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = await response.json();
          console.log(userData); // Log the received user data
          
          // Update the form data with user data
          setFormData({
            fullName: userData.full_name || '',
            email: userData.email || '',
            nik: userData.nik || '',
            phoneNumber: userData.phone_number || '',
            domisili: userData.domisili || '',
            jenisKelamin: userData.jenis_kelamin || ''
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
  
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitPressed(true);
  
    // Check if any of the form fields are empty
    if (
      formData.fullName === '' ||
      formData.email === '' ||
      formData.nik === '' ||
      formData.phoneNumber === '' ||
      formData.domisili === '' ||
      formData.jenisKelamin === ''
    ) {
      return;
    }
  
    // Check additional conditions (e.g., email format)
    if (!formData.email.endsWith('@telkomsel.co.id')) {
      return;
    }
  
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
      alert(data.message);
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Failed to update user: ${error}`);
    }
  };  

  return (
    <Stack paddingLeft={'125px'} paddingRight={'125px'}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Stack sx={{ width: '100%' }} spacing={10} maxHeight={'700px'}>
          <Stack spacing={1}>
            <Typography sx={{
              fontWeight: 700,
              fontSize: '42px',
              color: '#04214C',
            }}>
              Profile
            </Typography>
            <Typography sx={{
              fontWeight: 500,
              fontSize: '32px',
              color: '#04214C',
            }}>
              Lihat dan edit profil Anda disini
            </Typography>
          </Stack>
          <Stack spacing={2} maxWidth={'100%'}>
            <Stack direction={'row'} gap={2}>
              <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Nama Lengkap (Sesuai KTP)<span style={{ color: '#FF010C' }}>*</span>
                </Typography>
                <Input
                  disableUnderline
                  placeholder="Nama Lengkap"
                  style={{ fontSize: '22px', color: '#04214C' }}
                  sx={customInputStyle}
                  inputProps={{
                    'aria-label': 'Nama Lengkap',
                    name: 'fullName',
                    value: formData.fullName,
                    onChange: (e) => setFormData({ ...formData, fullName: (e.target as HTMLInputElement).value }),
                  }}
                />
                {(submitPressed && formData.fullName === '') && (
                  <Typography sx={{
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#FF010C',
                    marginTop: '4px',
                  }}>
                    *Nama lengkap tidak boleh kosong
                  </Typography>
                )}
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Email Telkomsel<span style={{ color: '#FF010C' }}>*</span>
                </Typography>
                <Input
                  disableUnderline
                  placeholder="Contoh: adimarnita@telkomsel"
                  sx={customInputStyle}
                  style={{ fontSize: '22px', color: '#04214C' }}
                  inputProps={{
                    'aria-label': 'Email Telkomsel',
                    name: 'email',
                    value: formData.email,
                    onChange: (e) => setFormData({ ...formData, email: (e.target as HTMLInputElement).value }),
                    disabled: true,
                    style: { backgroundColor: '#D9D9D9', color:'#6E6C6C' } 
                  }}
                />
                {(submitPressed && !formData.email.endsWith('@telkomsel.co.id')) && (
                  <Typography sx={{
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#FF010C',
                    marginTop: '4px',
                  }}>
                    *Inputkan email Telkomsel Anda
                  </Typography>
                )}
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Nomor Induk Kepegawaian<span style={{ color: '#FF010C' }}>*</span>
                </Typography>
                <Input
                  disableUnderline
                  placeholder="Contoh: 4321xx"
                  sx={customInputStyle}
                  style={{ fontSize: '22px', color: '#04214C' }}
                  inputProps={{
                    'aria-label': 'Nomor Induk Kepegawaian',
                    name: 'nik',
                    value: formData.nik,
                    onChange: (e) => setFormData({ ...formData, nik: (e.target as HTMLInputElement).value }),
                  }}
                />
                {(submitPressed && formData.nik === '') && (
                  <Typography sx={{
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#FF010C',
                    marginTop: '4px',
                  }}>
                    *NIK tidak boleh kosong
                  </Typography>
                )}
              </Stack>
              <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  No. handphone<span style={{ color: '#FF010C' }}>*</span>
                </Typography>
                <Input
                  disableUnderline
                  placeholder="No. handphone"
                  sx={customInputStyle}
                  style={{ fontSize: '22px', color: '#04214C' }}
                  inputProps={{
                    'aria-label': 'No. handphone',
                    name: 'phoneNumber',
                    value: formData.phoneNumber,
                    onChange: (e) => setFormData({ ...formData, phoneNumber: (e.target as HTMLInputElement).value }),
                  }}
                />
                {(submitPressed && formData.phoneNumber === '') && (
                  <Typography sx={{
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#FF010C',
                    marginTop: '4px',
                  }}>
                    *No handphone tidak valid
                  </Typography>
                )}
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Domisili<span style={{ color: '#FF010C' }}>*</span>
                </Typography>
                <MuiSelect
                  displayEmpty
                  inputProps={{ 'aria-label': 'Domisili' }}
                  style={{ borderRadius: '20px', fontSize: '22px', color: '#04214C', border: '1px solid #04214C', }}
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
                {(submitPressed && formData.domisili === '') && (
                  <Typography sx={{
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#FF010C',
                    marginTop: '4px',
                  }}>
                    *Domisili tidak valid
                  </Typography>
                )}
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Jenis Kelamin<span style={{ color: '#FF010C' }}>*</span>
                </Typography>
                <MuiSelect
                  displayEmpty
                  inputProps={{ 'aria-label': 'Jenis Kelamin' }}
                  style={{ borderRadius: '20px', fontSize: '22px', color: '#04214C', border: '1px solid #04214C', }}
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
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                >
                  <MenuItem value={formData.jenisKelamin}>
                    <em>{formData.jenisKelamin}</em>
                  </MenuItem>
                  <MenuItem value='Perempuan'>Perempuan</MenuItem>
                  <MenuItem value='Pria'>Pria</MenuItem>
                </MuiSelect>
                {(submitPressed && formData.jenisKelamin === '') && (
                  <Typography sx={{
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#FF010C',
                    marginTop: '4px',
                  }}>
                    *Jenis kelamin tidak valid
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing={3} alignItems={'center'} justifyContent={'center'} width={'100%'} direction={'row'}>
            <Button
              type="button"
              onClick={() => navigate('/profile-password', { state: { email: formData.email }})}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60px',
                width: 'auto',
                fontWeight: 'bold',
                fontSize: '24px',
                color: 'red',
                backgroundColor: '#FFF',
                borderRadius: '40px',
                paddingLeft: '60px',
                paddingRight: '60px',
                boxShadow: '0px 0px 0px 2px red',
                '&:active': {
                  backgroundColor: '#FF010C',
                },
                '&:focus': {
                  backgroundColor: '#FF010C',
                },
                '&:hover': { background: 'red', color: 'white', boxShadow: '0px 0px 0px 2px red', }
              }}
            >
              Ubah Password
            </Button>
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
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
}
