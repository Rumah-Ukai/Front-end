import { useState, useEffect } from 'react';
import { Stack, Typography, Input, MenuItem, Select as MuiSelect, TextField, CircularProgress } from '@mui/material';
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
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
    whiteSpace: 'pre-line',
  },
};
// interface Address  {
//   domisili: string;
//   coverabout: string;
//   footerabout: string;
//   deskripsiabout: string;
//   coverresto: string;
//   coverhotel: string;
//   coveroleh: string;
//   jenis: string;
// }
export default function Register() {
  const [loading, setLoading] = useState(false); // Add loading state
  const location = useLocation();
  const [formData, setFormData] = useState({
    domisili: '',
    coverabout: '',
    footerabout: '',
    deskripsiabout: '',
    coverresto: '',
    coverhotel: '',
    coveroleh: '',
    jenis: '',
    lokasi:[''],
  });
  // const [addresses, setAddress] = useState<Address[]>([]);

  const [gambarFiles, setGambarFiles] = useState<File[]>([]);
  const [gambar2, setGambar2] = useState('');
  const [gambar3, setGambar3] = useState('');
  const [gambar4, setGambar4] = useState('');
  const [gambar5, setGambar5] = useState('');
  // const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     formData.append('upload_preset', 'ml_default');
  
  //     const response = await fetch('https://api.cloudinary.com/v1_1/dgm5qtyrg/image/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to upload image');
  //     }
  
  //     const cloudinaryData = await response.json();
  //     return cloudinaryData.secure_url; // Return the URL of the uploaded image
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //     return null; // Return null if there was an error
  //   }
  // };  
  // const postDataToServer = async (address: Address) => {
  //   const { nama, google_map_url, jarak, gambar_file } = address;
  //   try {
  //     let gambar_url = '';

  //     if (gambar_file) {
  //       const formData = new FormData();
  //       formData.append('file', gambar_file);
  //       formData.append('upload_preset', 'ml_default');

  //       const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dgm5qtyrg/image/upload', {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       if (!cloudinaryResponse.ok) {
  //         throw new Error('Failed to upload image');
  //       }

  //       const cloudinaryData = await cloudinaryResponse.json();
  //       gambar_url = cloudinaryData.secure_url;
  //     }

  //     const response = await fetch(`https://tripselbe.fly.dev/addresses/${formData.nama}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         nama,
  //         gambar_url,
  //         google_map_url,
  //         jarak,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to post data');
  //     }

  //     return response.json();
  //   } catch (error) {
  //     console.error('Error posting data:', error);
  //   }
  // };
//   const uploadImagesToCloudinaryKamar = async (cabang: Address[], olehName: string) => {
//     try {
//         // Delete existing images first
//         try {
//             await deleteAddress(olehName);
//         } catch (error) {
//           console.log(olehName)
//             console.warn('Failed to delete existing images, proceeding to upload new images:', error);
//         }

//         // Upload new images
//         await Promise.all(
//             cabang.map(async (oleh, index) => {
//                 try {
//                     const response = await fetch(oleh.gambar_url);
//                     if (!response.ok) {
//                         throw new Error(`Failed to fetch image ${index}: ${response.status}`);
//                     }
//                     const blob = await response.blob();
//                     const formaddress = new FormData();
//                     formaddress.append('file', blob);
//                     formaddress.append('upload_preset', 'ml_default');
//                     console.log(blob)
//                     const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dgm5qtyrg/image/upload', {
//                         method: 'POST',
//                         body: formaddress,
//                     });

//                     if (!cloudinaryResponse.ok) {
//                         throw new Error(`Failed to upload image ${index} to Cloudinary`);
//                     }

//                     const cloudinaryData = await cloudinaryResponse.json();
//                     const imageUrl = cloudinaryData.secure_url;
//                     console.log(imageUrl)

//                     // Store image URL in the database
//                     const storeResponse = await fetch('https://tripselbe.fly.dev/addresses', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             gambar_url: imageUrl,
//                             oleh_nama: olehName,
//                             nama:oleh.nama,
//                             google_map_url:oleh.google_map_url,
//                             jarak:oleh.jarak
//                         }),
//                     });

//                     if (!storeResponse.ok) {
//                         throw new Error(`Failed to store image ${index} URL to database`);
//                     }
//                     console.log(`Image ${index} uploaded to Cloudinary and stored in database: ${imageUrl}`);
//                 } catch (error) {
//                   console.log(addresses)
//                     console.error(`Error uploading and storing image ${index}:`, error);
//                 }
//             })
//         );
//     } catch (error) {
//         console.error('Error uploading images:', error);
//     }
// };

  // const handleFileInputChangeAlamat = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setAddress((prevAddresses) => {
  //       const updatedAddresses = [...prevAddresses];
  //       updatedAddresses[index] = {
  //         ...updatedAddresses[index],
  //         gambar_preview: imageUrl,
  //         gambar_file: file,
  //       };
  //       return updatedAddresses;
  //     });
  //   }
  // };

  // const handleImageAlamat = (index: number) => {
  //   const fileInput = document.getElementById(`fileInputalamat${index}`) as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.click();
  //   }
  // };
  

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
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
      case 4:
        setGambar4(URL.createObjectURL(files[0]));
        break;
      case 5:
        setGambar5(URL.createObjectURL(files[0]));
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
        const response = await fetch(`https://tripselbe.fly.dev/area/${nama}`);
        const restoranData = await response.json();
   
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}: ${restoranData.error}`);
        }
     // Clean and split the price range
  const hargaArray = restoranData.parkir
  ? restoranData.parkir
      .replace(/Rp\s*/gi, '') // Remove "Rp" prefix and spaces
      .split('-') // Split by hyphen
      .map((harga: string) => harga.trim().replace(/[^0-9]+/g, '')) // Trim and keep only digits
  : [];
console.log(hargaArray)
// Extract the smallest and largest prices
const makananArray = restoranData.lokasi ? restoranData.lokasi.split(',') : [];

        setFormData({
          domisili: restoranData.domisili || '',
          coverabout: restoranData.coverabout || '',
          footerabout: restoranData.footerabout || '',
          deskripsiabout: restoranData.deskripsiabout || '',
          coverresto: restoranData.coverresto || '',
          coverhotel: restoranData.coverhotel || '',
          coveroleh: restoranData.coveroleh || '',
          jenis: restoranData.jenis || '',
          lokasi: makananArray,

        });
        // const fetchedAddresses = await getAddresses(restoranData.nama);
        // setAddress(fetchedAddresses);
            // // Fetch the kamar data
            // const imagesResponse2 = await fetch(`https://tripselbe.fly.dev/addresses/${nama}`);
            // const imagesData2 = await imagesResponse2.json();
            // setAddress(imagesData2);

      } catch (error) {
        console.error('Error fetching restoran data:', error);
      }
    };
    fetchRestoranData();
  }, [location]);
  
  // const deleteAllAddresses = async (oleh_nama: string) => {
  //   try {
  //     const response = await fetch(`https://tripselbe.fly.dev/addresses/${oleh_nama}`, {
  //       method: 'DELETE',
  //     });
  
  //     if (!response.ok) {
  //       const errorMessage = await response.text();
  //       throw new Error(`Failed to delete addresses: ${response.status}: ${errorMessage}`);
  //     }
  
  //     const data = await response.json();
  //     console.log(data.message); // Optionally log the message from the server
  //   } catch (error) {
  //     console.error('Error deleting addresses:', error);
  //     throw error;
  //   }
  // };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Ensure that only the images that have been changed are uploaded
      const uploadedImages = await Promise.all(
        gambarFiles.map((file, index) => {
          if (file) {
            return handleFileUpload(file, index);
          } else {
            // Use existing images from formData if they have not been changed
            switch (index) {
              case 0:
                return formData.coverabout;
              case 1:
                return formData.footerabout;
              case 2:
                return formData.coveroleh;
              case 3:
                return formData.coverresto;
              case 4:
                return formData.coverhotel;
              default:
                return null;
            }
          }
        })
      );
  
      // Check if any of the image uploads failed
      if (uploadedImages.some(image => image === null)) {
        throw new Error('One or more image uploads failed');
      }
  
      // Fetch existing data to get URLs of images not changed
      const existingResponse = await fetch(`https://tripselbe.fly.dev/area/${formData.domisili}`);
      if (!existingResponse.ok) {
        const errorMessage = await existingResponse.text();
        throw new Error(`Failed to fetch existing data: ${existingResponse.status}: ${errorMessage}`);
      }
  
      const existingData = await existingResponse.json();
      const lokasiString = formData.lokasi.join(',');
  
      // Update formData with either newly uploaded images or existing images
      const updatedFormData = {
        domisili: formData.domisili || '',
        deskripsiabout: formData.deskripsiabout || '',
        jenis: formData.jenis || '',
        coverabout: uploadedImages[0] || existingData.coverabout,
        footerabout: uploadedImages[1] || existingData.footerabout,
        coveroleh: uploadedImages[2] || existingData.coveroleh,
        coverhotel: uploadedImages[4] || existingData.coverhotel,
        coverresto: uploadedImages[3] || existingData.coverresto,
        lokasi: lokasiString || '',
      };
  
      // Send the updated formData to the server
      const response = await fetch(`https://tripselbe.fly.dev/area/${formData.domisili}`, {
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
  
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error updating restoran:', error);
      alert(`Failed to update restoran`);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleFileUpload = async (blob: Blob | null, index: number) => {
    try {
      if (!blob) return null; // If blob is null, return null
  
      const gambarbaru = new FormData();
      gambarbaru.append('file', blob);
      gambarbaru.append('upload_preset', 'ml_default');
  
      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/danakva2d/image/upload', {
        method: 'POST',
        body: gambarbaru,
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
  const handleImage4 = () => {
    const fileInput4 = document.getElementById('fileInput4');
    if (fileInput4) {
      fileInput4.click();
    }
  };
  
  const handleImage5 = () => {
    const fileInput5 = document.getElementById('fileInput5');
    if (fileInput5) {
      fileInput5.click();
    }
  };
  const handleInputChange = (index: number, value: string) => {
    const newMakanan = formData.lokasi.map((item, i) =>
      i === index ? value : item
    );

    setFormData({
      ...formData,
      lokasi: newMakanan,
    });
  };
  const handleDeleteMakanan = (index: number) => {
    const updatedMakanan = [...formData.lokasi];
    updatedMakanan.splice(index, 1);
    setFormData({
      ...formData,
      lokasi: updatedMakanan,
    });
  };
  const handleAddInput = () => {
    setFormData({
      ...formData,
      lokasi: [...formData.lokasi, ''],
    });
  };
  
  return (
    <Stack height="900px" sx={{overflowY:'none'}} padding={'0 30px'} overflow={'auto'}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Stack sx={{ width: 'auto' }} spacing={10} >
          <Typography fontWeight={500} fontSize={'42px'} color={'#04214C'}>
          Tambah Domisili
        </Typography>
        <Stack spacing={2} maxWidth={'100%'}>
            <Stack direction={'row'} gap={2}>
              <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
              Domisili
                </Typography>
                <Input
                  disableUnderline
                  placeholder="Contoh: Bali"
                  style={{ fontSize: '22px', color: '#04214C' }}
                  sx={customInputStyle}
                  inputProps={{
                    'aria-label': 'Domisili',
                    name: 'fullName',
                    value: formData.domisili,
                    onChange: (e) => setFormData({ ...formData, domisili: (e.target as HTMLInputElement).value }),
                  }}
                />
       
                <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Banner wisata
                </Typography>
                <Stack height={'auto'} width={'100%'} gap={2} direction={'column'} justifyContent={'space-between'}>
                <Stack
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'20px'}
                sx={{
                  background: `${gambar1 ? `url(${gambar1})` : formData.coverabout ? `url(${formData.coverabout})` : '#D9D9D9'}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                height={'188px'}
                width={'100%'}
                maxWidth={'100%'}
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
              <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Footer Wisata
                </Typography>
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'20px'}
                sx={{
                  background: `${gambar2 ? `url(${gambar2})` : formData.footerabout ? `url(${formData.footerabout})` : '#D9D9D9'}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                height={'188px'}
                width={'100%'}
                maxWidth={'100%'}
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
              <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Banner Oleh-oleh
                </Typography>

              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'20px'}
                sx={{
                  background: `${gambar3 ? `url(${gambar3})` : formData.coveroleh ? `url(${formData.coveroleh})` : '#D9D9D9'}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                height={'188px'}
                width={'100%'}
                maxWidth={'100%'}
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
              <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Banner Restoran
                </Typography>
                
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'20px'}
                sx={{
                  background: `${gambar4 ? `url(${gambar4})` : formData.coverresto ? `url(${formData.coverresto})` : '#D9D9D9'}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                height={'188px'}
                width={'100%'}
                maxWidth={'100%'}
                onClick={handleImage4}
              >
                {/* File input for image 1 */}
                <input
                  type="file"
                  id="fileInput4"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileInputChange(e, 4)}
                  />
              </Stack>
              <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Banner Hotel
                </Typography>
                
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'20px'}
                sx={{
                  background: `${gambar5 ? `url(${gambar5})` : formData.coverhotel ? `url(${formData.coverhotel})` : '#D9D9D9'}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                height={'188px'}
                width={'100%'}
                maxWidth={'100%'}
                onClick={handleImage5}
              >
                {/* File input for image 1 */}
                <input
                  type="file"
                  id="fileInput5"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileInputChange(e, 5)}
                  />
              </Stack>
                </Stack>
              </Stack>
                 
              <Stack direction={'column'} maxWidth={'100%'} width={'100%'} spacing={1}>
              <Typography sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#04214C'
                }}>
                  Jenis Kantor
                </Typography>
                <MuiSelect
                  displayEmpty
                  inputProps={{ 'aria-label': 'Jenis' }}
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
                  name="jenis"
                  value={formData.jenis}
                  onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                >
                  <MenuItem value={formData.jenis}>
                    <em>{formData.jenis}</em>
                  </MenuItem>
                  <MenuItem value='TSO'>Telekomsel Smart Office (TSO)</MenuItem>
                  <MenuItem value='Grapari'>Grapari</MenuItem>
                
                </MuiSelect>
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
                    value: formData.deskripsiabout,
                    onChange: (e) => setFormData({ ...formData, deskripsiabout: (e.target as HTMLInputElement).value }),
                  }}
                />
                <Stack>
                <Stack gap={2}>
                <Typography sx={{ fontWeight: 500, fontSize: '24px', color: '#04214C' }}>
                    Lokasi
                  </Typography>
                  {formData.lokasi.map((makanan, index) => (
  <Stack direction="row" alignItems="center" key={index} gap={1}>
  <Input
    disableUnderline
    placeholder={`Lokasi ${index + 1}`}
    style={{ fontSize: '22px', color: '#04214C' }}
    sx={customInputStyle}
    value={makanan}
    onChange={(e) => handleInputChange(index, (e.target as HTMLInputElement).value)}
  />
  <Button
                  type="button"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60px',
                    width: '240px',
                    fontWeight: 500,
                    fontSize: '22px',
                    color: '#FFF',
                    backgroundColor: '#04214C',
                    borderRadius: '20px',
                    '&:hover': { background: '#04214C', color: '#FFF'}
                  }}
    onClick={() => handleDeleteMakanan(index)}
  >
    Delete
  </Button>
</Stack>
                  ))}
                  <Button
                    type="button"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '60px',
                      width: '240px',
                      fontWeight: 500,
                      fontSize: '22px',
                      color: '#FFF',
                      backgroundColor: '#04214C',
                      borderRadius: '20px',
                      '&:hover': { background: '#04214C', color: '#FFF'}
                    }}
                    onClick={handleAddInput}
                  >
                    Tambah Lokasi
                  </Button>
                </Stack>
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
