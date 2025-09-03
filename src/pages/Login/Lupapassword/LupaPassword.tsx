import { ChangeEvent, useState } from 'react';
import { Grid, Stack, Box, Typography, Input, CircularProgress} from '@mui/material'; // Import CircularProgress
import { Button, Link } from '@mui/material';
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
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Fetch user information to check status
      const response = await fetch(`https://tripselbe.fly.dev/user/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user information');
      }

      const userData = await response.json();

      // Check if user status is 'guest'
      if (userData.status === 'guest') {
        throw new Error('Only registered users can reset their password');
      }

      // Send a request to the /resend-otp endpoint to send OTP to the email
      const otpResponse = await fetch('https://tripselbe.fly.dev/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!otpResponse.ok) {
        throw new Error('Failed to resend OTP');
      }

      // If OTP sent successfully, navigate to the verification page with the email in the URL query parameter
      navigate(`/verifikasi-lupa-password?nihotpemail=${email}`);
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., display error message)
    } finally {
      setLoading(false);
    }
  };

  const debouncedHandleLogin = debounce(handleLogin, 1000);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Reset loginError state when email changes
  };

  const isValidEmail = (email:string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@telkomsel\.co\.id$/;
    return emailPattern.test(String(email).toLowerCase());
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
          <Stack sx={{ width: '100%' }} spacing={5} maxHeight={'700px'}>
            <Stack justifyContent={'center'} alignContent={'center'} gap={5}>
              <Typography sx={{
                fontWeight: 700,
                fontSize: '42px',
                color:'#FF010C',
                textAlign:'center'
              }}>
                Lupa Password
              </Typography>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '22px',
                color:'#04214C',
                textAlign:'center'
              }}>
                Masukkan alamat Email yang terdaftar dengan akun Trip-sel. Kami akan mengirimkan link untuk melakukan reset password.
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
                  *Email salah
                </Typography>

            </Stack>
            <Stack spacing={3} alignItems={'center'} width={'100%'}>
              <Button
                disabled={loading || !email || !isValidEmail(email)} // Disable the button when loading or email is empty or invalid
                onClick={debouncedHandleLogin} // Use debounced handleLogin
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
                  '&:hover': { background: 'white', color: 'red', boxShadow: '0px 0px 0px 2px red',}
                }}
              >
                {loading ? <CircularProgress size={24} sx={{color:'white'}} /> : 'Reset Password'}
              </Button>
              <Stack direction={'row'} spacing={1}>
                <Link href='/login' sx={{
                  textDecoration: 'underline',
                  fontWeight: 500,
                  color: '#04214C',
                }}>
                  <Typography sx={{
                    fontWeight:500,
                    color:'#04214C',
                    fontSize:'22px',
                  }}>
                    Kembali ke Halaman Sign In
                  </Typography>
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
