import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Navbar  from './components/ui/navbar/navbar';
import Navbarwhite  from './components/ui/navbar/navbarwhite';
import Navbaradmin  from './components/ui/navbar/navbaradmin';
// import Adminlayout  from './pages/Admin/Login/adminlayout';
import { Quiz } from './pages/quiz';
import { AdminHotel } from './pages/Admin/Hotel';
import { AdminBeranda } from './pages/Admin/Beranda';
import { InputHotel } from './pages/Admin/Hotel/input';
import { AddHotel } from './pages/Admin/Hotel/add';
import { AdminRestoran } from './pages/Admin/Restoran';
import { InputRestoran } from './pages/Admin/Restoran/input';
import { InputDomisili } from './pages/Admin/Beranda/input';
import { AddDomisili } from './pages/Admin/Beranda/add';
import { AddRestoran } from './pages/Admin/Restoran/add';
import { AdminUser } from './pages/Admin/User';
import { InputUser } from './pages/Admin/User/input';
import { AddUser } from './pages/Admin/User/add';
import { AdminWisata } from './pages/Admin/Wisata';
import { InputWisata } from './pages/Admin/Wisata/input';
import { AddWisata } from './pages/Admin/Wisata/add';
import { AdminOleh } from './pages/Admin/Oleh';
import { InputOleh } from './pages/Admin/Oleh/input';
import { AddOleh } from './pages/Admin/Oleh/add';
import Footer from './components/ui/footer';
import { Beranda } from './pages/Beranda';
import { Login } from './pages/Login';
import { LoginAdmin } from './pages/Admin/Login';
// import { AdminLogin } from './pages/Admin/Login';
import { LupaPassword } from './pages/Login/Lupapassword';
import { LupaVerifikasi } from './pages/Login/Lupapassword/Lupaverifikasi';
import { Verifikasi } from './pages/Login/verification';
import { Register } from './pages/Registrasi';
import { Profile } from './pages/profile';
// import { ProfileLupaPassword } from './pages/profile/Lupapassword';
import { ProfileLupaVerifikasi } from './pages/profile/Lupapassword/Lupaverifikasi';
import { About } from './pages/About';
// import { Flores } from './pages/About/flores';
import { Bali } from './pages/About/list';
// import { Kupang } from './pages/About/kupang';
// import { Mataram } from './pages/About/mataram';
import {Oleh} from './pages/Oleh';
import {OlehBali} from './pages/Oleh/list';
import {Paket} from './pages/Paket';
// import {Tryout} from './pages/Paket/list';
// import {HotelNTT} from './pages/Hotel/ntt';
// import {HotelNTB} from './pages/Hotel/ntb';
// import {OlehMataram} from './pages/Oleh/OlehMataram';
// import {OlehKupang} from './pages/Oleh/OlehKupang';
// import {OlehFlores} from './pages/Oleh/OlehFlores';
import {Quizattempt} from './pages/Restoran';
import {RestoranBali} from './pages/Restoran/list';
// import {RestoranMataram} from './pages/Restoran/RestoranMataram';
// import {RestoranKupang} from './pages/Restoran/RestoranKupang';
// import {RestoranFlores} from './pages/Restoran/RestoranFlores';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import ProtectedRoute from './components/login/ProtectedRoute';
import ProtectedRouteAdmin from './components/login/ProtectedRouteAdmin';
import ProtectedRouteSuperAdmin from './components/login/ProtectedRouteSuperAdmin';



// const isAuthenticated = () => {
//   const token = localStorage.getItem('token');
//   const tokenExpiration = localStorage.getItem('tokenExpiration') as string; // Type assertion
//   // Check if token exists and if it's not expired
//   return token && Date.now() < parseInt(tokenExpiration);
// };

// Create a custom theme
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          textTransform: 'none',
        },
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      // <ProtectedRoute>
        <>
          <Navbar />
          <Beranda />
          <Footer />
        </>
      // </ProtectedRoute>
    )
  },
  {
    path: '/quiz',
    element: (
      // <ProtectedRoute>
      <>
        <Navbar />
        <Quiz />
        <Footer/>
      </>
      // </ProtectedRoute>
    )
  },
  {
    path: '/cari-wisata',
    element: (
      // <ProtectedRoute>
      <>
        <Navbarwhite />
        <About />
        <Footer/>
      </>
      // </ProtectedRoute>
    )
  },
  {
    path: '/wisata',
    element: (
      // <ProtectedRoute>
      <>
        <Navbar />
        <Bali />
        <Footer/>
      </>
      // </ProtectedRoute>
    )
  },
  // {
  //   path: '/wisata-kupang',
  //   element: (
  //     <ProtectedRoute>
  //     <>
  //       <Navbar />
  //       <Kupang />
  //       <Footer/>
  //     </>
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/wisata-mataram',
  //   element: (
  //     <ProtectedRoute>
  //     <>
  //       <Navbar />
  //       <Mataram />
  //       <Footer/>
  //     </>
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/wisata-flores',
  //   element: (
  //     <ProtectedRoute>
  //     <>
  //       <Navbar />
  //       <Flores />
  //       <Footer/>
  //     </>
  //     </ProtectedRoute>
  //   )
  // },
  {
    path: '/cari-oleh-oleh',
    element: (
      // <ProtectedRoute>
      <>
        <Navbarwhite />
        <Oleh />
        <Footer/>
      </>
      // </ProtectedRoute>
    )
  },
  {
    path: '/oleh-oleh',
    element: (
      // <ProtectedRoute>
      <>
        <Navbar />
        <OlehBali />
        <Footer/>
      </>
      // </ProtectedRoute>
    )
  },
  // {
  //   path: '/oleh-oleh-mataram',
  //   element: (
  //     <ProtectedRoute>
  //     <>
  //       <Navbar />
  //       <OlehMataram />
  //       <Footer/>
  //     </>
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/oleh-oleh-kupang',
  //   element: (
  //     <ProtectedRoute>
  //     <>
  //       <Navbar />
  //       <OlehKupang />
  //       <Footer/>
  //     </>
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/oleh-oleh-flores',
  //   element: (
  //     <ProtectedRoute>
  //     <>
  //       <Navbar />
  //       <OlehFlores/>
  //       <Footer/>
  //     </>
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/cari-restoran',
  //   element: (
  //     // <ProtectedRoute>
  //     <>
  //       <Navbarwhite />
  //       <Restoran />
  //       <Footer/>
  //     </>
  //     // </ProtectedRoute>
  //   )
  // },
  {
    path: '/restoran',
    element: (
      // <ProtectedRoute>
      <>
        <Navbar />
        <RestoranBali />
        <Footer/>
      </>
      // </ProtectedRoute>
    )
  },
  // {
  //   path: '/restoran-mataram',
  //   element: (
  //     <ProtectedRoute>
  //     <>
  //       <Navbar/>
  //       <RestoranMataram />
  //       <Footer/>
  //     </>
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/restoran-kupang',
  //   element: (
  //     <ProtectedRoute>
  //     <>
  //       <Navbar/>
  //       <RestoranKupang />
  //       <Footer/>
  //     </>
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/restoran-flores',
  //   element: (
  //     <ProtectedRoute>
  //     <>
  //       <Navbar/>
  //       <RestoranFlores/>
  //       <Footer/>
  //     </>
  //     </ProtectedRoute>
  //   )
  // },
  {
    path: '/paketku',
    element: (
    // <ProtectedRoute>
    <>
    <Navbar />
    <Paket/>,
    <Footer/>
    </>
    // </ProtectedRoute>
    )
  
    },
    {
      path: '/tryouts',
      element: (
        // <ProtectedRoute>
        <>
          <Navbar/>
          <Quizattempt/>
          <Footer/>
        </>
        // </ProtectedRoute>
      )
    },
    // {
    //   path: '/hotel-NTT',
    //   element: (
    //     <ProtectedRoute>
    //     <>
    //       <Navbar/>
    //       <HotelNTT />
    //       <Footer/>
    //     </>
    //     </ProtectedRoute>
    //   )
    // },
    // {
    //   path: '/hotel-NTB',
    //   element: (
    //     <ProtectedRoute>
    //     <>
    //       <Navbar/>
    //       <HotelNTB />
    //       <Footer/>
    //     </>
    //     </ProtectedRoute>
    //   )
    // },
    {
      path: '/profile',
      element: (
        // <ProtectedRoute>
        <>
          <Navbarwhite/>
          <Profile />
        </>
        // </ProtectedRoute>
      )
    },
    {
      path: '/profile-password',
      element: (
        <ProtectedRoute>
        <>
          <ProfileLupaVerifikasi />
        </>
        </ProtectedRoute>
      )
    },
    {
      path: '/admin',
      element: (
        <ProtectedRouteAdmin>
        <>
          <Navbaradmin />
        </>
        </ProtectedRouteAdmin>
      ),
            children: [
        {
          path: 'hotel', 
          element: <AdminHotel />,
        },
        {
          path: 'beranda', 
          element: <AdminBeranda />,
        },
        {
          path: 'input-hotel', 
          element: <InputHotel />,
        },
        {
          path: 'add-hotel', 
          element: <AddHotel />,
        }, 
        {
          path: 'restoran', 
          element: <AdminRestoran />,
        },
        {
          path: 'input-domisili', 
          element: <InputDomisili />,
        },
        {
          path: 'add-domisili', 
          element: <AddDomisili />,
        },
        {
          path: 'input-restoran', 
          element: <InputRestoran />,
        },
        {
          path: 'add-restoran', 
          element: <AddRestoran />,
        }, 
        {
          path: 'wisata', 
          element: <AdminWisata />,
        },
        {
          path: 'input-wisata', 
          element: <InputWisata />,
        },
        {
          path: 'add-wisata', 
          element: <AddWisata />,
        }, 
        {
          path: 'oleh-oleh', 
          element: <AdminOleh />,
        },
        {
          path: 'input-oleh-oleh', 
          element: <InputOleh />,
        },
        {
          path: 'add-oleh-oleh', 
          element: <AddOleh />,
        },
        {
          path: 'user', 
          element: (
            <ProtectedRouteSuperAdmin>
            <>
              <AdminUser />
            </>
            </ProtectedRouteSuperAdmin>
          ),
        },
        {
          path: 'input-user', 
          element: <InputUser />,
        },
        {
          path: 'add-user', 
          element: <AddUser />,
        }, 
      ],
    },
    {
      path: '/test',
      element: <AdminRestoran />,
    },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/login-admin',
    element: <LoginAdmin />,
  },
  {
    path: '/lupa-password',
    element: <LupaPassword />,
  },
  {
    path: '/Verifikasi-lupa-password',
    element: <LupaVerifikasi />,
  },
  {
    path: '/Verifikasi',
    element: <Verifikasi />,
  },
  {
    path: '/register',
    element: <Register />,
  }
]);

function App() {
  return (
    // Provide the custom theme to the entire app
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
