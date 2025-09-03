import { ChangeEvent, useEffect, useState } from 'react';
import { Grid, Stack, Box, Typography, Input, CircularProgress } from '@mui/material';
import { Button, Link } from '@mui/material';
import bg from '../../../assets/login.png';
import logo from '../../../assets/Trip-sel.png';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const saveTokenToLocalStorage = (token: string, expirationTime: number) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
  };  

  useEffect(() => {
    if (location.state && location.state.email && location.state.password) {
      setEmail(location.state.email);
      setPassword(location.state.password);
    }
  }, [location.state]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (resendTimer > 0) {
      timerId = setTimeout(() => {
        setResendTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }
    return () => clearTimeout(timerId);
  }, [resendTimer]);

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setResendTimer(30); // Reset timer to 30 seconds
      const response = await fetch('https://tripselbe.fly.dev/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          console.error('Error resending OTP:', data.error);
        } else {
          console.log('OTP resent successfully');
          console.log(password)
        }
      } else {
        console.error('HTTP error:', response.status);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
  
      const response = await fetch('https://tripselbe.fly.dev/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          otp_code: otp
        })
      });
  
      if (response.ok) {
        setLoading(false);
        setVerified(true);
        console.log(verified);
        const response = await axios.post('https://tripselbe.fly.dev/login', { email, password });
        const { token } = response.data;
    
        // Calculate token expiration time (e.g., 1 hour from now)
        const expirationTime = new Date().getTime() + 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    
        // Save token and its expiration time in localStorage
        saveTokenToLocalStorage(token, expirationTime);
        navigate('/')
      } else {
        // Check if OTP is expired or invalid
        if (response.status === 400) {
          const data = await response.json();
          if (data.error === 'expired') {
            alert('OTP has expired. Please request a new one.');
          } else {
            alert('Invalid OTP. Please try again.');
          }
        } else {
          // If the response is not okay (i.e., status code is not in the range 200-299)
          // you can handle it here, for example, by logging an error message
          console.error('Failed to verify OTP:', response.statusText);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
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
            borderTopLeftRadius: 0,
            paddingLeft: '0px',
            borderBottomLeftRadius: 0,
            '@media screen and (max-width: 899px)': {
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 0,
              padding: '2rem',
            },
          }}
        >

          <Stack sx={{ width: '100%' }} spacing={0} maxHeight={'700px'} gap={2}>
          {((!verified===true)) && (
            <Stack>
            <Stack justifyContent={'center'} alignContent={'center'} gap={2}>
              <Typography sx={{
                fontWeight: 700,
                fontSize: '42px',
                color: '#FF010C',
                textAlign: 'center'
              }}>
                Verifikasi
              </Typography>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '22px',
                color: '#04214C',
                textAlign: 'center'
              }}>
                Masukkan kode verifikasi yang telah dikirimkan ke {email}
              </Typography>
            </Stack>
            
            <Stack spacing={2}>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
                Kode Verifikasi
              </Typography>
              <Input
                disableUnderline
                placeholder="6 digit kode verifikasi"
                sx={customInputStyle}
                style={{ fontSize: '22px', color: '#04214C' }}
                inputProps={{
                  'aria-label': 'description',
                  type: 'number', // Set input type to number
                  inputMode: 'numeric', // Set input mode to numeric
                  pattern: '[0-9]*', // Allow only numbers
                }}
                value={otp}
                onChange={handleOtpChange}
              />
              <Typography sx={{
                fontWeight: 500,
                fontSize: '16px',
                color: 'transparent'
              }}>
                *Kode Verifikasi Salah
              </Typography>

            </Stack>
            
            <Stack spacing={3} alignItems={'center'} width={'100%'}>
            <Button
              disableElevation
              disableFocusRipple
              disableRipple
              disableTouchRipple 
              onClick={handleResendOTP}
              disabled={resendTimer > 0} // Disable button when timer is active
              sx={{
                fontWeight: 500,
                color: resendTimer > 0 ? '#6E6C6C' : '#FF010C', // Change color based on timer
                fontSize: '22px',
              }}
            >
              {resendTimer > 0 ? `Kirim ulang kode dalam ${resendTimer} detik` : 'Kirim Ulang Kode'}
            </Button>
              <Button
                disabled={loading}
                onClick={handleLogin}
                sx={{
                  display: 'flex',
                  width: 'auto',
                  height: '60px',
                  padding: '10px 30px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '40px',
                  background: '#FF010C',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: '24px',
                  '&:hover': { background: 'white', color: 'red', boxShadow: '0px 0px 0px 2px red', }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Verifikasi'}
              </Button>
              <Stack direction={'row'} spacing={1}>
                <Link href='/login' sx={{
                  textDecoration: 'underline',
                  fontWeight: 500,
                  color: '#04214C',
                }}>
                  <Typography sx={{
                    fontWeight: 500,
                    color: '#04214C',
                    fontSize: '22px',
                  }}>
                    Kembali ke Halaman Sign In
                  </Typography>
                </Link>
              </Stack>
              
              </Stack>
              </Stack>
          )}
          </Stack>

        </Grid>
      </Grid>
    </Box>
  );
}
