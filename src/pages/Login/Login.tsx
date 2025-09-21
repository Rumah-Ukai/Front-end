// src/pages/AuthPage.tsx
import { useState } from 'react';
import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  InputAdornment,

  CircularProgress,
  TextField,
  Alert,
  useTheme,
  useMediaQuery,

} from '@mui/material';
import axios from 'axios';
import bg from '../../assets/logoukai.png';
import { useNavigate } from 'react-router-dom';

type Mode = 'login' | 'register' | 'forgot' | 'verify-register' | 'verify-forgot';

export default function AuthPage(): JSX.Element {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // used for register & login
  const [newPassword, setNewPassword] = useState(''); // used for forgot verify
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
// di dalam komponen AuthPage
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const API_BASE = import.meta.env.VITE_API_BASE ;

  // Helper to clear messages
  const clearMsgs = () => {
    setMessage(null);
    setError(null);
  };

  const validateEmail = (value: string) => value.trim().length > 0;
  const validatePasswordLen = (v: string) => v.length >= 5;

  // Nice wrapper for axios errors -> friendly messages
  const friendlyErrorFromAxios = (err: unknown, fallback = 'Terjadi kesalahan') => {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const dataErr = err.response?.data?.error || err.response?.data?.message;

      // Common server responses mapping
      if (status === 401) {
        // unauthorized: either user not found or invalid password
        if (typeof dataErr === 'string') {
          if (dataErr.toLowerCase().includes('user not found') || dataErr.toLowerCase().includes('email')) {
            return 'Email tidak terdaftar';
          }
          if (dataErr.toLowerCase().includes('invalid password') || dataErr.toLowerCase().includes('password')) {
            return 'Password salah';
          }
        }
        return 'Kredensial tidak valid';
      }
      if (status === 403) {
        return (dataErr as string) || 'Akun belum terverifikasi. Cek email Anda.';
      }
      if (status === 404) {
        return (dataErr as string) || 'Data tidak ditemukan';
      }
      // if server gives a readable message, show it
      if (dataErr) return dataErr as string;
      // otherwise show fallback with status
      return `Gagal (${status ?? 'error'})`;
    }
    return fallback;
  };

  // LOGIN
  const handleLogin = async () => {
    clearMsgs();

    if (!validateEmail(email) || !password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      setMessage('Login berhasil — mengalihkan...');
      setTimeout(() => navigate('/'), 600);
    } catch (err: unknown) {
      const friendly = friendlyErrorFromAxios(err, 'Gagal login');
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  // REGISTER step 1 -> send code
  const handleRegister = async () => {
    clearMsgs();

    if (!validateEmail(email) || !validatePasswordLen(password)) {
      setError('Email wajib diisi dan password minimal 5 karakter');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/register`, { email, password, role: 'user' });

      // info message about email arrival time
      setMessage('Kode verifikasi dikirim. Mungkin tiba dalam beberapa menit — cek folder spam jika perlu.');
      setMode('verify-register');
    } catch (err: unknown) {
      const friendly = friendlyErrorFromAxios(err, 'Gagal mengirim kode registrasi');
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  // REGISTER verify
  const handleRegisterVerify = async () => {
    clearMsgs();

    if (!code) {
      setError('Masukkan kode verifikasi');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/register/verify`, { email, code });
      const { token } = res.data;
      localStorage.setItem('token', token);
      setMessage('Registrasi berhasil. Anda otomatis login.');
      setTimeout(() => navigate('/'), 700);
    } catch (err: unknown) {
      const friendly = friendlyErrorFromAxios(err, 'Gagal verifikasi registrasi');
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  // FORGOT step 1 send code
  const handleForgotSend = async () => {
    clearMsgs();
    if (!validateEmail(email)) {
      setError('Masukkan email yang terdaftar');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/user/send-code`, { email });
      setMessage('Kode reset dikirim. Mungkin tiba dalam beberapa menit — cek folder spam jika perlu.');
      setMode('verify-forgot');
    } catch (err: unknown) {
      const friendly = friendlyErrorFromAxios(err, 'Gagal mengirim kode reset');
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  // FORGOT verify -> set new password
  const handleForgotVerify = async () => {
    clearMsgs();
    if (!code || !validatePasswordLen(newPassword)) {
      setError('Kode dan password baru (minimal 5 karakter) wajib diisi');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/user/verify-code`, { email, code, newPassword });
      setMessage('Password berhasil diganti. Silakan login.');
      setMode('login');
      // clear password fields
      setPassword('');
      setNewPassword('');
      setCode('');
    } catch (err: unknown) {
      const friendly = friendlyErrorFromAxios(err, 'Gagal mengganti password');
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  // UI helpers
  const isEmailReadOnly = mode === 'verify-register' || mode === 'verify-forgot';

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
  
      }}
    >
      <Grid container sx={{ height: '100vh' }}>
        {/* panel kiri - gunakan paper token */}
        <Grid
  item
  xs={12}
  md={6}
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Stack height="100%" justifyContent="center" alignItems="center">
    <Box
      sx={{
    
        borderRadius: 4, // radius 16px
        boxShadow: 6, // elevasi
      
      }}
    >
      <img
        src={bg}
        alt="logo"
        style={{
          maxWidth: 400,
          width: '100%',
          borderRadius: '12px', // radius gambar juga
          display: 'block',
        }}
      />
    </Box>
  </Stack>
</Grid>


        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 6 }}>
          <Box sx={{ width: '100%', maxWidth: 520 }}>
            <Stack spacing={3}>
              <Stack>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {mode === 'login' && 'Masuk'}
                  {mode === 'register' && 'Daftar'}
                  {mode === 'forgot' && 'Lupa Password'}
                  {mode === 'verify-register' && 'Verifikasi Registrasi'}
                  {mode === 'verify-forgot' && 'Reset Password'}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white',fontWeight: 500  }}>
                  {mode === 'login' && 'Selamat datang di Rumah Ukai'}
                  {mode === 'register' && 'Isi email & password untuk membuat akun'}
                  {mode === 'forgot' && 'Masukkan email untuk menerima kode reset'}
                  {mode === 'verify-register' && 'Masukkan kode verifikasi yang dikirim ke email Anda (email tidak dapat diubah)'}
                  {mode === 'verify-forgot' && 'Masukkan kode dan password baru (email tidak dapat diubah)'}
                </Typography>
              </Stack>

              {/* ALERTS */}
              {message && <Alert severity="success">{message}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}

              {/* FORM */}
              <Stack spacing={2}  >
                {/* Email always shown but readonly in verify modes */}
                <TextField
  label="Email"
  sx={{
    input: { color: 'white' }, // teks input putih normal
    '& .MuiInputBase-input::placeholder': {
      color: 'white',
      opacity: 0.8,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: 'white' },
    },
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
    // fix autofill
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px #64483D inset', // ganti #121212 sesuai background form kamu
      WebkitTextFillColor: 'white', // tetap putih
      caretColor: 'white',
    },
  }}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  fullWidth
  size="medium"
  InputProps={{
    readOnly: isEmailReadOnly,
  }}
/>


                {/* Login & Register password */}
                {(mode === 'login' || mode === 'register') && (
                  <TextField
                    label="Password"
                   sx={{
  input: { color:'white' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'white' },
    '&:hover fieldset': { borderColor: 'white' },
    '&.Mui-focused fieldset': { borderColor: 'white' },

    // override autofill
    '& input:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 1000px 'white' inset`,
      WebkitTextFillColor:'white',
      transition: 'background-color 5000s ease-in-out 0s',
    },
  },
  '& .MuiInputLabel-root': { color: 'white' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
}}

                    type={'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" >
                         
                        </InputAdornment>
                      ),
                    }}
                      FormHelperTextProps={{
    sx: { color: 'white' }, // bikin helperText putih
  }}
                    helperText={mode === 'register' ? 'Password minimal 5 karakter' : undefined}
                    error={mode === 'register' && password.length > 0 && !validatePasswordLen(password)}
                  />
                )}

                {/* Verify / forgot fields */}
                {mode === 'verify-register' && (
                  <TextField
                    label="Kode verifikasi"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    fullWidth
                    sx={{
    input: { color: 'white' }, // teks input putih normal
    '& .MuiInputBase-input::placeholder': {
      color: 'white',
      opacity: 0.8,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: 'white' },
    },
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
    // fix autofill
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px #64483D inset', // ganti #121212 sesuai background form kamu
      WebkitTextFillColor: 'white', // tetap putih
      caretColor: 'white',
    },
  }}
                    helperText="Masukkan kode 6-digit yang dikirim ke email Anda"
                  />
                )}

                {mode === 'verify-forgot' && (
                  <>
                    <TextField  sx={{
    input: { color: 'white' }, // teks input putih normal
    '& .MuiInputBase-input::placeholder': {
      color: 'white',
      opacity: 0.8,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: 'white' },
    },
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
    // fix autofill
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px #64483D inset', // ganti #121212 sesuai background form kamu
      WebkitTextFillColor: 'white', // tetap putih
      caretColor: 'white',
    },
  }} label="Kode verifikasi" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />
                    <TextField
                      label="Password baru"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      fullWidth
                       sx={{
    input: { color: 'white' }, // teks input putih normal
    '& .MuiInputBase-input::placeholder': {
      color: 'white',
      opacity: 0.8,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: 'white' },
    },
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },
    // fix autofill
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px #64483D inset', // ganti #121212 sesuai background form kamu
      WebkitTextFillColor: 'white', // tetap putih
      caretColor: 'white',
    },
  }}
                      helperText="Minimal 5 karakter"
                      error={newPassword.length > 0 && !validatePasswordLen(newPassword)}
                    />
                  </>
                )}
              </Stack>

              {/* ACTION BUTTONS */}
             <Stack direction="row"   spacing={isMobile ? 0 : 2} // kalau mobile, hilangkan spacing kiri
 alignItems="center" flexWrap="wrap">
  {mode === 'login' && (
    <>
      <Button
        onClick={handleLogin}
        disabled={loading}
        sx={{
          px: 4,
          bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Masuk'}
      </Button>
      <Button
        onClick={() => { clearMsgs(); setMode('forgot'); }}
        sx={{
          
          // bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        Lupa Password
      </Button>
      <Button
        onClick={() => { clearMsgs(); setMode('register'); }}
        sx={{
          // bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        Registrasi
      </Button>
    </>
  )}

  {mode === 'register' && (
    <>
      <Button
        onClick={handleRegister}
        disabled={loading}
        sx={{
          px: 4,
          bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Kirim Kode (Daftar)'}
      </Button>
      <Button
        onClick={() => { clearMsgs(); setMode('login'); }}
        sx={{
          // bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        Kembali ke Login
      </Button>
    </>
  )}

  {mode === 'verify-register' && (
    <>
      <Button
        onClick={handleRegisterVerify}
        disabled={loading}
        sx={{
          bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Verifikasi & Masuk'}
      </Button>
      <Button
        onClick={() => { clearMsgs(); setMode('register'); }}
        sx={{
          // bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        Kembali
      </Button>
    </>
  )}

  {mode === 'forgot' && (
    <>
      <Button
        onClick={handleForgotSend}
        disabled={loading}
        sx={{
          bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Kirim Kode'}
      </Button>
      <Button
        onClick={() => { clearMsgs(); setMode('login'); }}
        sx={{
          // bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        Kembali
      </Button>
    </>
  )}

  {mode === 'verify-forgot' && (
    <>
      <Button
        onClick={handleForgotVerify}
        disabled={loading}
        sx={{
          bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Ganti Password'}
      </Button>
      <Button
        onClick={() => { clearMsgs(); setMode('login'); }}
        sx={{
          // bgcolor: '#462011',
          color: 'white',
          '&:hover': { bgcolor: '#5a2a17' },
        }}
      >
        Kembali
      </Button>
    </>
  )}
</Stack>

            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
