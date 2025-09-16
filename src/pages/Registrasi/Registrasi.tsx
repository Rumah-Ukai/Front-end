import { useState } from 'react';
import { Grid, Stack, Box, Typography, Input, IconButton } from '@mui/material';
import { Button, Link } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../../assets/logoukai.png';
import { useNavigate } from 'react-router-dom';

const customInputStyle = {
  width: '100%',
  height: '53px',
  '& input': {
    borderRadius: '20px',
    height: '53px',
    border: '2px solid #04214C',
    outline: 'none',
    padding: '0px 10px'
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
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [submitPressed, setSubmitPressed] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitPressed(true);

    if (!formData.email || !formData.password) {
      return;
    }

    if (formData.password.length < 8) {
      return;
    }

    try {
      const registerResponse = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!registerResponse.ok) {
        const errorMessage = await registerResponse.text();
        throw new Error(`Server responded with status ${registerResponse.status}: ${errorMessage}`);
      }

      const registerData = await registerResponse.json();
      alert(registerData.message);
      navigate('/beranda');
    } catch (error) {
      console.error('Error registering user:', error);
      alert(`Failed to register user ${error}`);
    }
  };

  return (
    <Box>
      <Grid container sx={{ height: '100vh' }}>
        <Grid item xs={12} md={6} sx={{ maxHeight: '100%' }}>
          <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Stack direction={'column'} sx={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Stack sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <img src={logo} alt="" width="100%" style={{ maxWidth: '314px' }} />
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid container justifyContent="center" alignItems="center" xs={12} md={6} px={8} py={2} sx={{ bgcolor: 'white', maxWidth: '674px' }}>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack sx={{ width: '100%' }} spacing={10}>
              <Stack spacing={1}>
                <Typography sx={{ fontWeight: 700, fontSize: '42px', color: '#FF010C' }}>Daftar Akun</Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '32px', color: '#FF010C' }}>Lengkapi data diri Anda</Typography>
              </Stack>
              <Stack spacing={2}>

                {/* Email */}
                <Stack direction={'column'} spacing={1}>
                  <Typography sx={{ fontWeight: 500, fontSize: '24px', color: '#04214C' }}>
                    Email<span style={{ color: '#FF010C' }}>*</span>
                  </Typography>
                  <Input
                    disableUnderline
                    placeholder="Contoh: email@example.com"
                    sx={customInputStyle}
                    style={{ fontSize: '22px', color: '#04214C' }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: (e.target as HTMLInputElement).value })}
                  />
                  {submitPressed && !formData.email && (
                    <Typography sx={{ fontWeight: 500, fontSize: '16px', color: '#FF010C', marginTop: '4px' }}>
                      *Email tidak boleh kosong
                    </Typography>
                  )}
                </Stack>

                {/* Password */}
                <Stack direction={'column'} spacing={1}>
                  <Typography sx={{ fontWeight: 500, fontSize: '24px', color: '#04214C' }}>
                    Password<span style={{ color: '#FF010C' }}>*</span>
                  </Typography>
                  <Input
                    disableUnderline
                    id="password"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    sx={customInputStyle}
                    style={{ fontSize: '22px', color: '#04214C' }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: (e.target as HTMLInputElement).value })}
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
                  />
                  {submitPressed && formData.password.length < 8 && (
                    <Typography sx={{ fontWeight: 500, fontSize: '16px', color: '#FF010C', marginTop: '4px' }}>
                      *Masukan minimal 8 huruf
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
                    '&:hover': { background: 'white', color: 'red', boxShadow: '0px 0px 0px 2px red' }
                  }}
                >
                  Daftar
                </Button>
                <Typography sx={{ fontWeight: 500, fontSize: '22px', color: '#04214C' }}>
                  Sudah memiliki akun?{' '}
                  <Link href="/login" underline='always' sx={{ color: '#FF010C', fontWeight: 700, textDecorationColor: '#FF010C' }}>
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
