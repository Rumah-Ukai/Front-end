import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Drawer, List, ListItem, ListItemText, Stack, Typography, Button, IconButton, Menu, MenuItem, Divider, useMediaQuery } from '@mui/material';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import logoTripsel from '../../../assets/logoukai.png';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useTheme } from '@mui/material/styles';
import { Menu as MenuIcon } from '@mui/icons-material';

export default function Navbar() {
  const [isOpaque, setIsOpaque] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [menuActive, setMenuActive] = useState(false);
  const [userFullName, setUserFullName] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/user', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data && data.full_name) {
            setUserFullName(data.full_name);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleProfileMenuOpen = (event: React.SyntheticEvent) => {
    setProfileAnchorEl(event.currentTarget as HTMLElement);
    handleMenuOpen();
  };

  const handleMenuOpen = () => {
    setMenuActive(true);
  };

  const handleMenuClose = () => {
    setProfileAnchorEl(null);
    setMenuActive(false);
  };

  const handleBerandamenu = () => {
    navigate(`/`)
  }
  const handleProfilemenu = () => {
    navigate(`/profile`)
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate(`/login`)
  }

  const primary = 'red';
  const secondary = 'black';
  const bgClr = 'white';

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsOpaque(scrollTop > 0 || menuActive);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuActive]);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: bgClr,
        transition: 'background-color 0.3s ease-in-out',
        boxShadow: isOpaque ? '0px 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
        padding: { xs: '0px 16px', sm: '0px 20px', md: '0px 30px' },
        height: { xs: '70px', sm: '80px', md: '105px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
      }}
    >
      {/* Logo - Responsive sizing */}
      <Stack sx={{ width: { xs: '70px', sm: '80px', md: '100px' } }}>
        <img style={{ width: '100%', height: 'auto' }} src={logoTripsel} alt="logo" />
      </Stack>

      {/* Desktop Menu */}
      {!isMobile && (
        <Stack direction="row" spacing={{ xs: 1, sm: 2, md: 3 }} alignItems="center">
          <Button
            disableElevation
            disableRipple
            onClick={handleBerandamenu}
            sx={{
              color: secondary,
              '&:hover': { color: primary, fontWeight: 700 },
              minWidth: 'auto',
              padding: '0px',
            }}
          >
            <Typography sx={{ fontSize: { sm: 20, md: 24 } }}>Beranda</Typography>
          </Button>

          <Button
            disableElevation
            disableRipple
            onClick={handleBerandamenu}
            sx={{
              color: secondary,
              '&:hover': { color: primary, fontWeight: 700 },
              minWidth: 'auto',
              padding: '0px',
            }}
          >
            <Typography sx={{ fontSize: { sm: 20, md: 24 } }}>Paketku</Typography>
          </Button>

          <Button
            disableElevation
            disableRipple
            onClick={handleProfileMenuOpen}
            sx={{
              color: 'black',
              '&:hover': { color: primary, fontWeight: 700 },
              minWidth: 'auto',
              padding: '0px',
            }}
          >
            <Icon icon="gg:profile" width={isSmallMobile ? '30' : '40'} height={isSmallMobile ? '30' : '40'} style={{ color: 'inherit' }} />
            <Typography sx={{ 
              fontSize: { sm: 18, md: 22 }, 
              ml: 1,
              display: { xs: 'none', sm: 'block' }
            }}>
              {userFullName.length > 12 ? `${userFullName.slice(0, 12)}..` : userFullName}
            </Typography>
          </Button>

          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleMenuClose}
            elevation={0}
            PaperProps={{
              style: {
                background: bgClr,
                boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
                width: '270px',
                borderRadius: '0 0 30px 30px',
              },
            }}
          >
            <MenuItem onClick={handleProfilemenu} sx={{ color: 'black' }}>Profile</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'black' }}>Sign out</MenuItem>
          </Menu>
        </Stack>
      )}

      {/* Mobile Menu */}
      {isMobile && (
        <>
          <IconButton
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ color: secondary }}
          >
            <MenuIcon fontSize={isSmallMobile ? 'medium' : 'large'} />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            PaperProps={{ 
              style: { 
                width: isSmallMobile ? '200px' : '250px',
                paddingTop: '20px'
              } 
            }}
          >
            <List sx={{ padding: '0' }}>
              <ListItem 
                onClick={() => {
                  handleBerandamenu();
                  handleDrawerToggle();
                }}
                sx={{ padding: '12px 24px' }}
              >
                <ListItemText 
                  primary="Beranda" 
                  primaryTypographyProps={{ fontSize: isSmallMobile ? '16px' : '18px' }} 
                />
              </ListItem>
              <Divider />
              <ListItem 
                onClick={() => {
                  handleBerandamenu();
                  handleDrawerToggle();
                }}
                sx={{ padding: '12px 24px' }}
              >
                <ListItemText 
                  primary="Paketku" 
                  primaryTypographyProps={{ fontSize: isSmallMobile ? '16px' : '18px' }} 
                />
              </ListItem>
              <Divider />
              {userFullName && (
                <>
                  <ListItem 
                    onClick={() => {
                      handleProfilemenu();
                      handleDrawerToggle();
                    }}
                    sx={{ padding: '12px 24px' }}
                  >
                    <ListItemText 
                      primary="Profile" 
                      primaryTypographyProps={{ fontSize: isSmallMobile ? '16px' : '18px' }} 
                    />
                  </ListItem>
                  <Divider />
                  <ListItem 
                    onClick={() => {
                      handleLogout();
                      handleDrawerToggle();
                    }}
                    sx={{ padding: '12px 24px' }}
                  >
                    <ListItemText 
                      primary="Sign out" 
                      primaryTypographyProps={{ fontSize: isSmallMobile ? '16px' : '18px' }} 
                    />
                  </ListItem>
                </>
              )}
            </List>
          </Drawer>
        </>
      )}
    </AppBar>
  );
}