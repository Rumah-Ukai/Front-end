import { ChangeEvent, useState } from 'react';
import { Grid, Stack, Box, Typography, Input, CircularProgress } from '@mui/material'; // Import CircularProgress
import { Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { debounce } from 'lodash';
import bg from '../../../assets/login.png';
import logo from '../../../assets/Trip-sel.png'
import { useNavigate } from 'react-router-dom';

const customInputStyle = {
  width: '100%',
  height: '53px',
  '& input': {
    borderRadius: '20px',
    height: '53px',
    border: '1px solid #04214C', // Apply border directly to the input
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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false); // State to manage login error
  const navigate = useNavigate();

  const debouncedHandleLogin = debounce(handleLogin, 1000);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Reset loginError state when email changes
    setLoginError(false);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Reset loginError state when password changes
    setLoginError(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  async function handleLogin() {
    try {
      setLoading(true);

      // Check user status
      const userResponse = await axios.get(`https://tripselbe.fly.dev/user/${email}`);
      const { status } = userResponse.data;
      
      if (status === 'Admin' || status === 'Super Admin') {
        // User is not a guest, proceed with login
        const response = await axios.post('https://tripselbe.fly.dev/login', { email, password });
        const { token } = response.data;
    
        // Calculate token expiration time (e.g., 1 hour from now)
        const expirationTime = new Date().getTime() + 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    
        // Save token and its expiration time in localStorage
        saveTokenToLocalStorage(token, expirationTime);
    
        setLoading(false);
    
        // Return Navigate component to redirect to the home page after successful login
        navigate(`/admin/beranda`);
      } else {
        // User is a guest, redirect to verification page
        setLoading(false);
        alert('Hanya Admin yang boleh masuk!')
        console.log(status);

        // navigate(`/verifikasi`, { state: { email: email, password: password } }); // Pass email as a state to /verifikasi
      }

    } catch (error) {
      console.log('Invalid email or password');
      setLoading(false);
      setLoginError(true); // Set loginError state to true on error
    }
  }

  // Function to save token and its expiration time in localStorage
  const saveTokenToLocalStorage = (token: string, expirationTime: number) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
  };

  return (
    <Box>
      <Grid container sx={{ height: '100vh' }}>
        <Grid item xs={12} md={6} sx={{ maxHeight: '100%' }}>
          <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Stack direction={'column'} sx={{ display: { md: 'flex' },width:'100%', height: '100%', justifyContent:'center',alignContent:'center', alignItems:'center' }}>
              <Stack sx={{ width:'100%', justifyContent:'center', alignItems:'center' }}>
                <img
                  src={logo}
                  alt=""
                  width="100%"
                  style={{maxWidth:'314px'}}
                />
              </Stack>
              <img
                src={bg}
                alt=""
                width="100%"
                style={{maxWidth:'550px', maxHeight:'550px'}}
              />
              <Typography sx={{
                fontWeight: 700,
                fontSize: '42px',
                color:'#FF010C',
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
            borderTopLeftRadius: 0,
            paddingLeft:'0px',
            borderBottomLeftRadius: 0,
            '@media screen and (max-width: 899px)': {
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 0,
              padding: '2rem',
            },
          }}
        >
          <Stack sx={{ width: '100%' }} spacing={10} maxHeight={'700px'}>
            <Stack spacing={1}>
              <Typography sx={{
                fontWeight: 700,
                fontSize: '42px',
                color:'#FF010C',
              }}>
                Masuk
              </Typography>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '32px',
                color:'#FF010C',
              }}>
                Selamat datang di Dashboard Trip-sel
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color:'#04214C'
              }}>
                Email
              </Typography>
              <Input
                disableUnderline
                placeholder="Email"
                sx={customInputStyle}
                style={{fontSize:'22px', color:'#04214C'}}
                inputProps={{
                  'aria-label': 'description',
                }}
                value={email}
                onChange={handleEmailChange}
                
              />

                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '16px',
                  color:'transparent'
                }}>
                  *Email atau password salah
                </Typography>

              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color:'#04214C'
              }}>
                Password
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
                }}
                value={password}
                onChange={handlePasswordChange}
              />
              
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '16px',
                  color: loginError ? '#FF010C': 'transparent'
                }}>
                  *Email atau password salah
                </Typography>
                
            </Stack>
            <Stack spacing={3} alignItems={'center'} width={'100%'}>
              <Button
                disabled={loading} // Disable the button when loading
                onClick={debouncedHandleLogin} // Use debounced handleLogin
                sx={{
                  display: 'flex',
                  width: '200px',
                  height: '60px',
                  padding: '10px 20px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '40px',
                  background: '#FF010C',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: '24px',
                  '&:hover': { background: 'white', color: 'red', boxShadow: '0px 0px 0px 2px red',}
                }}
              >
                {loading ? <CircularProgress size={24} sx={{color:'white'}} /> : 'Masuk'}
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}