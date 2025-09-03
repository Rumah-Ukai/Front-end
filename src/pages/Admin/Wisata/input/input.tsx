import { useState, useEffect } from 'react';
import { Stack, Typography, Input, MenuItem, Select as MuiSelect, TextField, CircularProgress } from '@mui/material';
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
import axios from 'axios';

const customInputStyle = {
  width: '100%',
  height: '53px',
  '& input': {
    borderRadius: '20px',
    height: '53px',
    border: '2px solid #04214C',
    outline: 'none',
    padding: '0px 10px',
    fontWeight:500,
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
const customInputStyle2 = {
  width: '100%',
  height: 'auto',
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    '& fieldset': {
      borderColor: '#04214C', // Apply border color here
      border: '2px solid #04214C', 
    },
    '&:hover fieldset': {
      borderColor: '#04214C',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#04214C',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#04214C',
    '&.Mui-focused': {
      color: 'transparent',
    },
  },
  '& .MuiInputBase-input': {
    fontWeight: 500, // Change font weight here
    color:'#04214C',
    fontSize: '22px', // Change font size here
    
  },
};


interface Area {
  domisili: string;
}
export default function Register() {
  const [areaData, setAreaData] = useState<Area[]>([]);
  useEffect(() => {
    // Fetch the area data from the backend
    axios.get(`https://tripselbe.fly.dev/area`)
      .then((response) => {
        setAreaData(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching area data:', error);
      });
  
}, []);
  const location = useLocation();
  const [formData, setFormData] = useState({
    nama: '',
    domisili: '',
    tiket_masuk: '',
    tikettermurah: '',
    tikettermahal: '',
    parkirtermurah: '',
    parkirtermahal: '',
    parkir: '',
    description: '',
    alamat_gbr: '',
    gambar_url1: '',
    gambar_url2: '',
    gambar_url3: '',
    link_menu: '',
    alamat_url: '',
    youtube_url:'',
  });
  
  const [gambarFiles, setGambarFiles] = useState<File[]>([]);
  const [gambar2, setGambar2] = useState('');
  const [gambar3, setGambar3] = useState('');
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    const maxFileSize = 7 * 1024 * 1024; // 7 MB in bytes

    if (files && files.length && files[0].size > maxFileSize) {
        alert('File size exceeds the maximum allowed limit of 7 MB. Please choose a smaller file.');
        // Clear the file input to cancel the upload
        e.target.value = '';
        return;
    }

    if (files?.length) {
        setGambarFiles(prevFiles => {
            const newFiles = [...prevFiles];
            newFiles[index - 1] = files[0]; // Index is 1-based, so subtract 1
            return newFiles;
        });
    }
    if (files) {
        switch (index) {
            case 1:
                setGambar1(URL.createObjectURL(files[0]));
                break;
            case 2:
                setGambar2(URL.createObjectURL(files[0]));
                break;
            case 3:
                setGambar3(URL.createObjectURL(files[0]));
                break;
            default:
                break;
        }
    }
};


  useEffect(() => {
    const fetchRestoranData = async () => {
      const { nama } = location.state;
  
      try {
        const response = await fetch(`https://tripselbe.fly.dev/wisata/${nama}`);
        const restoranData = await response.json();
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}: ${restoranData.error}`);
        }
       // Split the harga into hargatermurah and hargatermahal
       const hargaArray = restoranData.tiket_masuk 
       ? restoranData.tiket_masuk.replace(/Rp\s*/gi, '').split('-').map((harga: string) => harga.trim().replace(/[^0-9]+/g, '')) 
       : [];
     
       const tikettermurah = hargaArray[0] || ''; // Get the smallest price
        const tikettermahal = hargaArray[1] || ''; // Get the largest price
        const hargaArray2 = restoranData.parkir
        ? restoranData.tiket_masuk.replace(/Rp\s*/gi, '').split('-').map((harga: string) => harga.trim().replace(/[^0-9]+/g, '')) 
        : [];
      
        const parkirtermurah = hargaArray2[0] || ''; // Get the smallest price
         const parkirtermahal = hargaArray2[1] || ''; // Get the largest price
     
        setFormData({
          nama: restoranData.nama || '',
          domisili: restoranData.domisili || '',
          tiket_masuk: restoranData.tiket_masuk || '',
          parkir: restoranData.parkir || '',
          description: restoranData.description || '',
          alamat_gbr: restoranData.alamat_gbr || '',
          gambar_url1: restoranData.gambar_url1 || '',
          gambar_url2: restoranData.gambar_url2 || '',
          gambar_url3: restoranData.gambar_url3 || '',
          link_menu: restoranData.link_menu || '',
          alamat_url: restoranData.alamat_url || '',
          youtube_url: restoranData.youtube_url || '',
          tikettermurah:  tikettermurah,
          tikettermahal: tikettermahal,
          parkirtermurah:  parkirtermurah,
          parkirtermahal: parkirtermahal,
        });
      } catch (error) {
        console.error('Error fetching restoran data:', error);
      }
    };
    fetchRestoranData();
  }, [location]);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to false when submission is complete

    try {
        // Fetch existing data to get current URLs
        const existingResponse = await fetch(`https://tripselbe.fly.dev/wisata/${formData.nama}`);
        if (!existingResponse.ok) {
            const errorMessage = await existingResponse.text();
            throw new Error(`Failed to fetch existing data: ${existingResponse.status}: ${errorMessage}`);
        }

        const existingData = await existingResponse.json();

        // Step 1: Upload new images
        const uploadedImages = await Promise.all(gambarFiles.map((file, index) => handleFileUpload(file, index + 1)));

        // Check if all uploads were successful
        if (uploadedImages.some(image => image === null)) {
            throw new Error('One or more image uploads failed');
        }
        const hargaString = `Rp ${formData.tikettermurah.toLocaleString()} - Rp ${formData.tikettermahal.toLocaleString()}`;
        const hargaString2 = `Rp ${formData.parkirtermurah.toLocaleString()} - Rp ${formData.parkirtermahal.toLocaleString()}`;

        const updatedFormData = {
            ...formData,
            gambar_url1: uploadedImages[0] || existingData.gambar_url1,
            gambar_url2: uploadedImages[1] || existingData.gambar_url2,
            gambar_url3: uploadedImages[2] || existingData.gambar_url3,
            tiket_masuk: hargaString || '',
            parkir: hargaString2 || ''

        };

        // Step 2: Update the oleh entry
        const response = await fetch(`https://tripselbe.fly.dev/wisata/${formData.nama}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFormData),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Server responded with status ${response.status}: ${errorMessage}`);
        }

        console.log(updatedFormData);
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error updating restoran:', error);
        alert(`Failed to update restoran: ${error}`);
    }finally {
      setLoading(false); // Set loading to false when submission is complete
    }
};

  const handleFileUpload = async (file: File | null, index: number) => {
    try {
      if (!file) return null; // If file is null, return null
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
  
      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/danakva2d/image/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!cloudinaryResponse.ok) {
        throw new Error(`Failed to upload image ${index} to Cloudinary`);
      }
      
      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;
  
      console.log(`Image ${index} uploaded to Cloudinary: ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      console.error(`Error uploading image ${index} to Cloudinary:`, error);
      return null;
    }
  };
  
  
  const [gambar1, setGambar1] = useState('');

  const handleImage1 = () => {
    const fileInput1 = document.getElementById('fileInput1');
    if (fileInput1) {
      fileInput1.click();
    }
  };
  
  const handleImage2 = () => {
    const fileInput2 = document.getElementById('fileInput2');
    if (fileInput2) {
      fileInput2.click();
    }
  };
  
  const handleImage3 = () => {
    const fileInput3 = document.getElementById('fileInput3');
    if (fileInput3) {
      fileInput3.click();
    }
  };

  return (
    <Stack height="900px" sx={{overflowY:'none'}} padding={'0 30px'} overflow={'auto'}>
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Stack sx={{ width: 'auto' }} spacing={10} >
      <Typography fontWeight={500} fontSize={'42px'} color={'#04214C'}>
        Tambah Data Wisata
      </Typography>
        <Stack spacing={2} maxWidth={'100%'}>
          <Stack direction={'row'} gap={2}>
            <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
              nama Restoran
              </Typography>
              <Input
                disableUnderline
                placeholder="Nama Restoran"
                style={{ fontSize: '22px', color: '#04214C' }}
                sx={customInputStyle}
                inputProps={{
                  'aria-label': 'Nama Restoran',
                  name: 'fullName',
                  value: formData.nama,
                  onChange: (e) => setFormData({ ...formData, nama: (e.target as HTMLInputElement).value }),
                }}
              />

              <Stack direction={'row'} justifyContent={'space-between'} gap={2}>
              <Stack width={'100%'} height={'100%'}>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
                Domisili
              </Typography>
              <MuiSelect
                displayEmpty
                inputProps={{ 'aria-label': 'Domisili' }}
                style={{ borderRadius: '20px', fontSize: '22px', color: '#04214C', border: '2px solid #04214C', }}
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
                  {areaData?.map((domi, index) => (
    <MenuItem key={`${domi.domisili}_${index}`} value={domi.domisili}>
      {domi.domisili}
    </MenuItem>
  ))}
              </MuiSelect>
              
              </Stack>

              </Stack>
             

              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
              Tiket Masuk
              </Typography>
              <Stack direction={'row'} gap={2} >
              <Stack direction={'row'} alignItems={'center'}>
                <Stack justifyContent={'center'} alignItems={'center'} height={'53px'} width={'auto'} border={'2px solid #04214C'} borderRight={'none'} borderRadius={'20px 0 0 20px'}>
                <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C',
                padding:'15px'
              }}>
                Rp
              </Typography>
                </Stack>
              <Input
              disableUnderline
                placeholder="Termurah"
                sx={customInputStyle}
                style={{ fontSize: '22px', color: '#04214C' }}
                inputProps={{
                  'aria-label': 'Hargatermurah',
                  name: 'email',
                  value: formData.tikettermurah,
                  onChange: (e) => setFormData({ ...formData, tikettermurah: (e.target as HTMLInputElement).value }),
                  style: { color:'#04214C', borderTopLeftRadius:'0px', borderBottomLeftRadius:'0px' } 
                }}
              />
              </Stack>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
                -
              </Typography>
              <Stack direction={'row'} alignItems={'center'}>
              <Stack justifyContent={'center'} alignItems={'center'} height={'53px'} width={'auto'} border={'2px solid #04214C'} borderRight={'none'} borderRadius={'30px 0 0 30px'}>
                <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C',
                padding:'15px'
              }}>
                Rp
              </Typography>
                </Stack>
              <Input
              disableUnderline
                placeholder="Termahal"
                sx={customInputStyle}
                style={{ fontSize: '22px', color: '#04214C' }}
                inputProps={{
                  'aria-label': 'Hargatermahal',
                  name: 'email',
                  value: formData.tikettermahal,
                  onChange: (e) => setFormData({ ...formData, tikettermahal: (e.target as HTMLInputElement).value }),
                  style: { color:'#04214C', borderTopLeftRadius:'0px', borderBottomLeftRadius:'0px' } 
                }}
              />
              </Stack>
              </Stack>




              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
              Parkir
              </Typography>
              <Stack direction={'row'} gap={2} >
              <Stack direction={'row'} alignItems={'center'}>
                <Stack justifyContent={'center'} alignItems={'center'} height={'53px'} width={'auto'} border={'2px solid #04214C'} borderRight={'none'} borderRadius={'20px 0 0 20px'}>
                <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C',
                padding:'15px'
              }}>
                Rp
              </Typography>
                </Stack>
              <Input
              disableUnderline
                placeholder="Termurah"
                sx={customInputStyle}
                style={{ fontSize: '22px', color: '#04214C' }}
                inputProps={{
                  'aria-label': 'Hargatermurah',
                  name: 'email',
                  value: formData.parkirtermurah,
                  onChange: (e) => setFormData({ ...formData, parkirtermurah: (e.target as HTMLInputElement).value }),
                  style: { color:'#04214C', borderTopLeftRadius:'0px', borderBottomLeftRadius:'0px' } 
                }}
              />
              </Stack>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
                -
              </Typography>
              <Stack direction={'row'} alignItems={'center'}>
              <Stack justifyContent={'center'} alignItems={'center'} height={'53px'} width={'auto'} border={'2px solid #04214C'} borderRight={'none'} borderRadius={'30px 0 0 30px'}>
                <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C',
                padding:'15px'
              }}>
                Rp
              </Typography>
                </Stack>
              <Input
              disableUnderline
                placeholder="Termahal"
                sx={customInputStyle}
                style={{ fontSize: '22px', color: '#04214C' }}
                inputProps={{
                  'aria-label': 'Hargatermahal',
                  name: 'email',
                  value: formData.parkirtermahal,
                  onChange: (e) => setFormData({ ...formData, parkirtermahal: (e.target as HTMLInputElement).value }),
                  style: { color:'#04214C', borderTopLeftRadius:'0px', borderBottomLeftRadius:'0px' } 
                }}
              />
              </Stack>
              </Stack>

              <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
              Link Youtube
              </Typography>
              <TextField
              multiline
                variant='outlined'
                placeholder="Link Youtube"
                sx={customInputStyle2}
                style={{ fontSize: '22px', color: '#04214C' }}
                inputProps={{
                  'aria-label': 'Link Youtube',
                  name: 'Link Youtube',
                  value: formData.youtube_url,
                  onChange: (e) => setFormData({ ...formData, youtube_url: (e.target as HTMLInputElement).value }),
                }}
              />
              </Stack>
            </Stack>
            <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
              Deskripsi
              </Typography>
              <TextField
              multiline
                variant='outlined'
                placeholder="Maksimal 255 huruf"
                sx={customInputStyle2}
                inputProps={{
                  'aria-label': 'Maksimal 255 huruf',
                  name: 'deskripsi',
                  value: formData.description,
                  onChange: (e) => setFormData({ ...formData, description: (e.target as HTMLInputElement).value }),
                }}
              />
              <Stack>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
                Gambar
              </Typography>
              <Stack height={'190px'} gap={2} direction={'row'} justifyContent={'space-between'}>
              <Stack
justifyContent={'center'}
alignItems={'center'}
borderRadius={'20px'}
sx={{
  background: `${gambar1 ? `url(${gambar1})` : formData.gambar_url1 ? `url(${formData.gambar_url1})` : '#D9D9D9'}`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}}
height={'100%'}
width={'100%'}
maxWidth={'33%'}
onClick={handleImage1}
>
              {/* File input for image 1 */}
              <input
                type="file"
                id="fileInput1"
                style={{ display: 'none' }}
                onChange={(e) => handleFileInputChange(e, 1)}
                />
            </Stack>
            <Stack
              justifyContent={'center'}
              alignItems={'center'}
              borderRadius={'20px'}
              sx={{
                background: `${gambar2 ? `url(${gambar2})` : formData.gambar_url2 ? `url(${formData.gambar_url2})` : '#D9D9D9'}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              height={'100%'}
              width={'100%'}
              maxWidth={'33%'}
              onClick={handleImage2}
            >
              {/* File input for image 1 */}
              <input
                type="file"
                id="fileInput2"
                style={{ display: 'none' }}
                onChange={(e) => handleFileInputChange(e, 2)}
                />
            </Stack>
            <Stack
              justifyContent={'center'}
              alignItems={'center'}
              borderRadius={'20px'}
              sx={{
                background: `${gambar3 ? `url(${gambar3})` : formData.gambar_url3 ? `url(${formData.gambar_url3})` : '#D9D9D9'}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              height={'100%'}
              width={'100%'}
              maxWidth={'33%'}
              onClick={handleImage3}
            >
              {/* File input for image 1 */}
              <input
                type="file"
                id="fileInput3"
                style={{ display: 'none' }}
                onChange={(e) => handleFileInputChange(e, 3)}
                />
            </Stack>
              </Stack>
              </Stack>
              <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
              </Stack>
              <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '24px',
                color: '#04214C'
              }}>
              Link Alamat
              </Typography>
              <TextField
              multiline
                variant='outlined'
                placeholder="Link Alamat"
                sx={customInputStyle2}
                style={{ fontSize: '22px', color: '#04214C' }}
                inputProps={{
                  'aria-label': 'Link Alamat',
                  name: 'Link Alamat',
                  value: formData.alamat_url,
                  onChange: (e) => setFormData({ ...formData, alamat_url: (e.target as HTMLInputElement).value }),
                }}
              />
              </Stack>
            </Stack>
          </Stack>
         
        </Stack>
        <Stack spacing={3} alignItems={'center'} justifyContent={'center'} width={'100%'} direction={'row'} height={'120px'}>
        {loading ? (
              <CircularProgress />
            ) : (
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
            )}
        </Stack>
      </Stack>
    </form>
  </Stack>
  );
}
