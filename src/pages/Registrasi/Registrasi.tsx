import { useState } from 'react';
import { Grid, Stack, Box, Typography, Input, IconButton, MenuItem, Select as MuiSelect } from '@mui/material';
import { Button, Link } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import bg from '../../assets/login.png';
import logo from '../../assets/Trip-sel.png';
import { useNavigate } from 'react-router-dom';

const customInputStyle = {
  width: '100%',
  height: '53px',
  '& input': {
    borderRadius: '20px',
    height: '53px',
    border: '2px solid #04214C', // Apply border directly to the input
    outline: 'none',
    padding: '0px 10px'
  },
  '& .MuiInputLabel-root': {
    color: '#6E6C6C', // Initially make label transparent
    '&.Mui-focused': {
      color: 'transparent', // Change label color when focused
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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nik: '',
    phoneNumber: '',
    domisili: '',
    jenisKelamin: '',
    password: '',
    confirmPassword: '',
    status: '' 
  });
  const [submitPressed, setSubmitPressed] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // interface FormDataObject {
  //   fullName: string;
  //   email: string;
  //   nik: string;
  //   phoneNumber: string;
  //   domisili: string;
  //   jenisKelamin: string;
  //   password: string;
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitPressed(true); // Button is pressed
  
    // Check if any of the fields are empty
    if (
      formData.fullName === '' ||
      formData.email === '' ||
      formData.nik === '' ||
      formData.phoneNumber === '' ||
      formData.domisili === '' ||
      formData.jenisKelamin === '' ||
      formData.password === '' ||
      formData.confirmPassword === '' // Check if confirmPassword is empty
    ) {
      return; // Prevent form submission
    }
  
    // Check if email ends with "@telkomsel.co.id"
    if (!formData.email.endsWith('@telkomsel.co.id')) {
      return; // Prevent form submission
    }
  
    // Check if password has at least 8 characters
    if (formData.password.length < 8) {
      return; // Prevent form submission
    }
  
    // Check if password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      return; // Prevent form submission
    }
  
    try {
      // Check if user with the provided email exists
      const response = await fetch(`https://tripselbe.fly.dev/user/${formData.email}`);
      if (response.ok) {
        const userData = await response.json();
        // Check if user status is "guest"
        if (userData.status === 'guest') {
          // Update existing user data
          const updateData = { ...formData };
          // Check if the user status was guest before
          if (userData.status === 'guest') {
            // Set the user status to be the same as before
            updateData.status = userData.status;
          }
          const updateResponse = await fetch('https://tripselbe.fly.dev/user', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          });
    
          if (!updateResponse.ok) {
            // Handle non-200 HTTP status codes
            const errorMessage = await updateResponse.text();
            throw new Error(`Server responded with status ${updateResponse.status}: ${errorMessage}`);
          }
    
          alert('User data updated successfully');
          navigate(`/verifikasi`, { state: { email: formData.email, password: formData.password } });
        } else {
          // User already exists, display error message
          alert('User with provided email already exists');
        }
      } else {
        // User does not exist, proceed with registration
        const registerResponse = await fetch('https://tripselbe.fly.dev/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        if (!registerResponse.ok) {
          // Handle non-200 HTTP status codes
          const errorMessage = await registerResponse.text();
          throw new Error(`Server responded with status ${registerResponse.status}: ${errorMessage}`);
        }
    
        const registerData = await registerResponse.json();
        alert(registerData.message); // Display success message from the server
        navigate(`/verifikasi`, { state: { email: formData.email, password: formData.password } });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert(`Failed to register user ${error}`); // Alert the specific error message
    }    
  };
  

  return (
    <Box>
      <Grid container sx={{ height: '100vh' }}>
        <Grid item xs={12} md={6} sx={{ maxHeight: '100%' }}>
          <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Stack direction={'column'} sx={{ display: { md: 'flex' }, width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <Stack sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={logo}
                  alt=""
                  width="100%"
                  style={{ maxWidth: '314px' }}
                />
              </Stack>
              <img
                src={bg}
                alt=""
                width="100%"
                style={{ maxWidth: '550px', maxHeight: '550px' }}
              />
              <Typography sx={{
                fontWeight: 700,
                fontSize: '42px',
                color: '#FF010C',
              }}>
                #TripwithTelkomsel
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          xs={12}
          md={6}
          px={8}
          py={2}
          sx={{
            bgcolor: 'white',
            padding: '0px',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            maxWidth: '674px',
            '@media screen and (max-width: 899px)': {
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 0,
            },
          }}
        >
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack sx={{ width: '100%' }} spacing={10} maxHeight={'700px'}>
              <Stack spacing={1}>
                <Typography sx={{
                  fontWeight: 700,
                  fontSize: '42px',
                  color: '#FF010C',
                }}>
                  Daftar Akun
                </Typography>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '32px',
                  color: '#FF010C',
                }}>
                  Lengkapi data diri Anda
                </Typography>
              </Stack>
              <Stack spacing={2} maxWidth={'674px'}>
                <Stack direction={'row'} gap={2}>
                  <Stack direction={'column'} maxWidth={'393px'} width={'100%'} spacing={1}>
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
                      style={{fontSize:'22px', color:'#04214C'}}
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
                        marginTop:'4px',
                      }}>
                        *Nama lengkap tidak boleh kosong
                      </Typography>
                    )}
                     {(submitPressed && formData.fullName !== '') && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
                      }}>
                        *Nama lengkap tidak boleh kosong
                      </Typography>
                    )}
                    {(submitPressed === false) && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
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
                      style={{fontSize:'22px', color:'#04214C'}}
                      inputProps={{
                        'aria-label': 'Email Telkomsel',
                        name: 'email',
                        value: formData.email,
                        onChange: (e) => setFormData({ ...formData, email: (e.target as HTMLInputElement).value }),
                      }}
                    />
                    {(submitPressed &&!formData.email.endsWith('@telkomsel.co.id')) && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: '#FF010C',
                        marginTop:'4px',
                      }}>
                        *Inputkan email Telkomsel Anda
                      </Typography>
                    )}
                    {(submitPressed && formData.email.endsWith('@telkomsel.co.id')) && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
                      }}>
                        *Inputkan email Telkomsel Anda
                      </Typography>
                    )}
                    {(submitPressed === false) && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
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
                      style={{fontSize:'22px', color:'#04214C'}}
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
                        marginTop:'4px',
                      }}>
                        *NIK tidak boleh kosong
                      </Typography>
                    )}
                    {(submitPressed && formData.nik !== '') && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
                      }}>
                        *NIK tidak boleh kosong
                      </Typography>
                    )}
                    {(submitPressed === false) && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
                      }}>
                        *NIK tidak boleh kosong
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction={'column'} maxWidth={'262px'} width={'100%'} spacing={1}>
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
                      style={{fontSize:'22px', color:'#04214C'}}
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
                        marginTop:'4px',
                      }}>
                        *No handphone tidak valid
                      </Typography>
                    )}
                    {(submitPressed && formData.phoneNumber !== '') && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
                      }}>
                        *No handphone tidak valid
                      </Typography>
                    )}
                  {(submitPressed === false) && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
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
                    style={{ borderRadius: '20px', fontSize:'22px', color:'#04214C', border: '1px solid #04214C', }}
                    sx={{
                      ...customInputStyle,
                      '&:focus': {
                        borderColor: 'transparent !important', // Set border color on focus
                      },
                      '& fieldset': {
                        borderColor: 'transparent !important', // Set default border color
                      },
                      '&:hover fieldset': {
                        borderColor: 'transparent !important', // Set border color on hover
                      },
                      '&:active fieldset': {
                        borderColor: 'transparent !important', // Set border color when active (clicked)
                      },
                    }}
                    name="domisili"
                    value={formData.domisili}
                    onChange={(e) => setFormData({ ...formData, domisili: (e.target as HTMLInputElement).value })}
                  >

                      <MenuItem value="">
                        <em>Pilih Domisili</em>
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
                        marginTop:'4px',
                      }}>
                        *Domisili tidak valid
                      </Typography>
                    )}
                    {(submitPressed && formData.domisili !== '') && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
                      }}>
                        *Domisili tidak valid
                      </Typography>
                    )}
                    {(submitPressed === false) && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
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
                      style={{ borderRadius: '20px', fontSize:'22px', color:'#04214C', border: '1px solid #04214C', }}
                      sx={{
                        ...customInputStyle,
                        '&:focus': {
                          borderColor: 'transparent !important', // Set border color on focus
                        },
                        '& fieldset': {
                          borderColor: 'transparent !important', // Set default border color
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent !important', // Set border color on hover
                        },
                        '&:active fieldset': {
                          borderColor: 'transparent !important', // Set border color when active (clicked)
                        },
                      }}
                      name="jenisKelamin"
                      value={formData.jenisKelamin}
                      onChange={(e) => setFormData({ ...formData, jenisKelamin: (e.target as HTMLInputElement).value })}
                    >
                       <MenuItem value="">
                        <em>Pilih Jenis Kelamin</em>
                      </MenuItem>
                      <MenuItem value='Perempuan'>Perempuan</MenuItem>
                      <MenuItem value='Pria'>Pria</MenuItem>
                    </MuiSelect>
                    {(submitPressed && formData.jenisKelamin !== '') && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
                      }}>
                        *Jenis kelamin tidak valid
                      </Typography>
                    )}
                    {(submitPressed === false) && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'transparent',
                        marginTop:'4px',
                      }}>
                        *Jenis kelamin tidak valid
                      </Typography>
                    )}
                    {(submitPressed && formData.jenisKelamin === '') && (
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: '#FF010C',
                        marginTop:'4px',
                      }}>
                        *Jenis kelamin tidak valid
                      </Typography>
                    )}
                  </Stack>
                </Stack>
                <Stack>
                  <Typography sx={{
                    fontWeight: 500,
                    fontSize: '24px',
                    color: '#04214C'
                  }}>
                    Password<span style={{ color: '#FF010C' }}>*</span>
                  </Typography>
                  <Input
                    disableUnderline
                    id="password"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    sx={customInputStyle}
                    style={{fontSize:'22px', color:'#04214C'}}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      name: 'password',
                      value: formData.password,
                      onChange: (e) => setFormData({ ...formData, password: (e.target as HTMLInputElement).value }),
                    }}
                  />
                  {((submitPressed && formData.password === '') || (submitPressed && formData.password.length < 8)) && (
                    <Typography sx={{
                      fontWeight: 500,
                      fontSize: '16px',
                      color: '#FF010C',
                      marginTop:'4px',
                    }}>
                      *Masukan minimal 8 huruf
                    </Typography>
                  )}
                  {(submitPressed && formData.password !== '') && (
                    <Typography sx={{
                      fontWeight: 500,
                      fontSize: '16px',
                      color: 'transparent',
                      marginTop:'4px',
                    }}>
                      *Masukan minimal 8 huruf
                    </Typography>
                  )}
                    {(submitPressed === false) && (
                    <Typography sx={{
                      fontWeight: 500,
                      fontSize: '16px',
                      color: 'transparent',
                      marginTop:'4px',
                    }}>
                      *Masukan minimal 8 huruf
                    </Typography>
                  )}
                </Stack>
                <Stack>
                <Typography sx={{
                    fontWeight: 500,
                    fontSize: '24px',
                    color: '#04214C',
                  }}>
                    konfirmasi Password<span style={{ color: '#FF010C' }}>*</span>
                  </Typography>
                  <Input
                    disableUnderline
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    style={{fontSize:'22px', color:'#04214C'}}
                    sx={customInputStyle}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      name: 'confirmPassword',
                      value: formData.confirmPassword,
                      onChange: (e) => setFormData({ ...formData, confirmPassword: (e.target as HTMLInputElement).value }),
                    }}
                  />
                  {(submitPressed && formData.confirmPassword !== formData.password) && (
                    <Typography sx={{
                      fontWeight: 500,
                      fontSize: '16px',
                      color: '#FF010C',
                      marginTop:'4px',
                    }}>
                      *Password tidak sesuai
                    </Typography>
                  )}
                   {(submitPressed && formData.confirmPassword === formData.password) && (
                    <Typography sx={{
                      fontWeight: 500,
                      fontSize: '16px',
                      color: 'transparent',
                      marginTop:'4px',
                    }}>
                      *Password tidak sesuai
                    </Typography>
                  )}
                  {(submitPressed === false) && (
                    <Typography sx={{
                      fontWeight: 500,
                      fontSize: '16px',
                      color: 'transparent',
                      marginTop:'4px',
                    }}>
                      *Password tidak sesuai
                    </Typography>
                  )}
                </Stack>
              </Stack>
              <Stack spacing={3} alignItems={'center'} width={'100%'}>
                <Button
                  type="submit"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60px',
                    width: '200px',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    color: '#ffffff',
                    backgroundColor: '#FF010C',
                    borderRadius: '40px',
                    '&:active': {
                      backgroundColor: '#FF010C', 
                    },
                    '&:focus': {
                      backgroundColor: '#FF010C', 
                    },
                    '&:hover': { background: 'white', color: 'red', boxShadow: '0px 0px 0px 2px red',}
                  }}
                >
                  Daftar
                </Button>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '22px',
                  color: '#04214C',
                }}>
                  Sudah memiliki akun?{' '}
                  <Link href="/login" underline='always' sx={{ color: '#FF010C', fontWeight:700, textDecorationColor: '#FF010C'  }}>
                    Masuk disini
                  </Link>
                </Typography>
              </Stack>
            </Stack>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}