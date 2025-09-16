// src/pages/Profile/Profile.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Snackbar,
  Stack,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Link,
} from '@mui/material';

// import asset images (sesuaikan path kalau lokasi file berbeda)
import foto1 from '../../assets/fotouser/foto1.png';
import foto2 from '../../assets/fotouser/foto2.png';
import foto3 from '../../assets/fotouser/foto3.png';

// mapping key -> src (ini yang disimpan di DB: "foto1", "foto2", ...)
const FOTO_MAP: Record<string, string> = {
  foto1,
  foto2,
  foto3,
};

const AVAILABLE_PHOTOS = [
  { key: 'foto1', src: foto1 },
  { key: 'foto2', src: foto2 },
  { key: 'foto3', src: foto3 },
];

export default function Profile(): JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // user data dari backend
  const [email, setEmail] = useState<string>('');
  const [fotoKey, setFotoKey] = useState<string | null>(null);

  // foto selector dialog
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [savingPhoto, setSavingPhoto] = useState(false);

  // password state
  const [password, setPassword] = useState<string>(''); // real password input
  const [sendingPassword, setSendingPassword] = useState(false);

  // verifikasi password state
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState(0);

  // notifications
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'info' | 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // fetch user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (data.email) setEmail(data.email);
        if (data.foto) setFotoKey(data.foto);
      } catch (err) {
        console.error('Failed to fetch user', err);
        setSnackbar({ open: true, message: 'Gagal memuat data pengguna', severity: 'error' });
      }
    };
    fetchUser();
  }, []);

  // timer countdown untuk resend kode
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // derived avatar src
  const avatarSrc = fotoKey && FOTO_MAP[fotoKey] ? FOTO_MAP[fotoKey] : undefined;

  const openPhotoDialog = () => {
    setSelectedKey(fotoKey ?? AVAILABLE_PHOTOS[0].key);
    setPhotoDialogOpen(true);
  };

  const closePhotoDialog = () => {
    setPhotoDialogOpen(false);
    setSelectedKey(null);
  };

  const handleSelectPhoto = (key: string) => {
    setSelectedKey(key);
  };

  const handleSavePhoto = async () => {
    if (!selectedKey) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbar({ open: true, message: 'Anda harus login', severity: 'error' });
      return;
    }

    setSavingPhoto(true);
    try {
      const res = await fetch('http://localhost:3000/user/foto', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foto: selectedKey }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server: ${res.status} ${txt}`);
      }

      setFotoKey(selectedKey);
      setSnackbar({ open: true, message: 'Foto profil berhasil diperbarui', severity: 'success' });
      setPhotoDialogOpen(false);
    } catch (err) {
      console.error('Error saving photo', err);
      setSnackbar({ open: true, message: 'Gagal menyimpan foto profil', severity: 'error' });
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleSendPasswordVerification = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbar({ open: true, message: 'Anda harus login', severity: 'error' });
      return;
    }

    setSendingPassword(true);
    try {
      const res = await fetch('http://localhost:3000/user/send-code', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server: ${res.status} ${txt}`);
      }

      setSnackbar({ open: true, message: 'Email verifikasi password dikirim', severity: 'success' });
      setVerificationMode(true);
      setTimer(60); // mulai timer 1 menit
    } catch (err) {
      console.error('Error sending password verification', err);
      setSnackbar({ open: true, message: 'Gagal mengirim email verifikasi', severity: 'error' });
    } finally {
      setSendingPassword(false);
    }
  };

  const handleConfirmPassword = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbar({ open: true, message: 'Anda harus login', severity: 'error' });
      return;
    }

    try {
      // contoh fetch di frontend
const res = await fetch('http://localhost:3000/user/verify-code', {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ code: verificationCode, newPassword: password })
});


      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server: ${res.status} ${txt}`);
      }

      const data = await res.json();
      setSnackbar({ open: true, message: data.message || 'Verifikasi berhasil', severity: 'success' });
      setVerificationMode(false);
      setVerificationCode('');
    } catch (err) {
      console.error('Error verifying code', err);
      setSnackbar({ open: true, message: 'Kode verifikasi salah atau expired', severity: 'error' });
    }
  };

  const handleResendCode = () => {
    // Pastikan resend menunggu timer habis (UI sudah mencegah jika timer>0)
    handleSendPasswordVerification();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box display="flex" justifyContent="center" p={{ xs: 2, sm: 4 }} sx={{ width: '100%' }}>
      <Card sx={{ width: '100%', maxWidth: 920 }}>
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h5">Profile</Typography>

            {/* Foto & ganti */}
            <Stack alignItems="center" spacing={1}>
              <Avatar src={avatarSrc} sx={{ width: 120, height: 120 }} alt="Foto pengguna" />
              <Button variant="outlined" onClick={openPhotoDialog}>
                Ganti Foto
              </Button>
            </Stack>

            {/* Informasi Email */}
            <Box sx={{ width: '100%' }}>
              <TextField
                label="Email"
                value={email}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Box>

            {/* Password + Verifikasi */}
            <Stack direction={isSmall ? 'column' : 'row'} spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                placeholder="********"
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, maxWidth: 600 }} // kecilin field password
              />

              <Button
                variant="contained"
                onClick={verificationMode ? handleConfirmPassword : handleSendPasswordVerification}
                disabled={sendingPassword}
                sx={{ flex: 1, minWidth: 160, height: 56 }}
              >
                {sendingPassword ? (
                  <CircularProgress size={20} color="inherit" />
                ) : verificationMode ? (
                  'Konfirmasi'
                ) : (
                  'Verifikasi'
                )}
              </Button>
            </Stack>

            {/* Input kode verifikasi muncul setelah klik Verifikasi */}
            {verificationMode && (
              <Box sx={{ width: '100%' }}>
                <TextField
                  label="Kode Verifikasi"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                {timer > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Kirim ulang kode dalam {timer}s
                  </Typography>
                ) : (
                  <Link component="button" variant="body2" onClick={handleResendCode}>
                    Kirim ulang kode
                  </Link>
                )}
              </Box>
            )}

            {/* Logout */}
            <Box sx={{ width: '100%' }}>
              <Button variant="contained" color="error" fullWidth onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Dialog pilih foto */}
      <Dialog open={photoDialogOpen} onClose={closePhotoDialog} fullWidth maxWidth="md">
        <DialogTitle>Pilih Foto Profil</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
              <Avatar src={selectedKey ? FOTO_MAP[selectedKey] : avatarSrc} sx={{ width: 160, height: 160 }} alt="Preview" />
            </Box>
            <Box
              sx={{
                display: 'grid',
                gap: 12,
                gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)' },
                alignItems: 'center',
              }}
            >
              {AVAILABLE_PHOTOS.map((p) => {
                const isSelected = selectedKey === p.key;
                return (
                  <Box
                    key={p.key}
                    onClick={() => handleSelectPhoto(p.key)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: isSelected ? '3px solid' : '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 0.5,
                    }}
                  >
                    <Box
                      component="img"
                      src={p.src}
                      alt={p.key}
                      sx={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closePhotoDialog} variant="text">
            Batal
          </Button>
          <Button onClick={handleSavePhoto} variant="contained" disabled={!selectedKey || savingPhoto}>
            {savingPhoto ? <CircularProgress size={18} color="inherit" /> : 'Simpan Foto'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        message={snackbar.message}
      />
    </Box>
  );
}
