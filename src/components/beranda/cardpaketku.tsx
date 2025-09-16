import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Stack,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// ================== SHAPE ==================
interface Shape {
  id: number;
  x: number;
  size: number;
  type: 'circle' | 'square' | 'triangle';
}

const GlobalShapes: Shape[] = Array.from({ length: 10 }).map((_, i) => {
  const types: Shape['type'][] = ['circle', 'square', 'triangle'];
  return {
    id: i,
    x: Math.random() * 100,
    size: 20 + Math.random() * 200,
    type: types[Math.floor(Math.random() * types.length)],
  };
});

// ================== SHAPE CARD ==================
interface PackageCardProps {
  title: string;
}
interface UserPaket {
  id: string;
  name: string;
  price: number;
  created_at: string;
  image?: string | null;
  closed_at?: string | null; // ✅ kolom baru
}
function PackageCard({ title }: PackageCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const colors = [
    '#E74C3C',
    '#3498DB',
    '#2ECC71',
    '#9B59B6',
    '#F39C12',
    '#1ABC9C',
    '#34495E',
  ];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Stack
      ref={containerRef}
      style={{
        width: '100%',
        height: '140px',
        backgroundColor: bgColor,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {GlobalShapes.map((s) => {
        const baseStyle: React.CSSProperties = {
          left: `${s.x}%`,
          width: s.size,
          height: s.size,
          transform: 'translateX(-50%)',
          position: 'absolute',
        };

        const isFilled = Math.random() > 0.5;
        let shapeEl;

        if (s.type === 'circle') {
          shapeEl = (
            <div
              style={{
                ...baseStyle,
                borderRadius: '50%',
                border: isFilled ? 'none' : '3px solid white',
                background: isFilled ? 'white' : 'inherit',
              }}
            />
          );
        } else if (s.type === 'square') {
          shapeEl = (
            <div
              style={{
                ...baseStyle,
                border: isFilled ? 'none' : '3px solid white',
                background: isFilled ? 'white' : 'inherit',
              }}
            />
          );
        } else {
          shapeEl = (
            <div
              style={{
                ...baseStyle,
                width: 0,
                height: 0,
                borderLeft: `${s.size / 2}px solid transparent`,
                borderRight: `${s.size / 2}px solid transparent`,
                borderBottom: `${s.size}px solid white`,
                background: 'inherit',
              }}
            />
          );
        }

        if (!isMobile) {
          return (
            <motion.div
              key={s.id}
              style={baseStyle}
              initial={{ top: -250 }}
              animate={{ top: '200vh' }}
              transition={{
                duration: 18 + Math.random() * 30,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 100,
              }}
            >
              {shapeEl}
            </motion.div>
          );
        }

        return (
          <Stack
            key={s.id}
            style={{
              ...baseStyle,
              backgroundColor: bgColor,
              top: `${0 + Math.random() * 60}%`,
            }}
          />
        );
      })}

      <Stack
        height={'100%'}
        sx={{
          zIndex: 5,
          color: isMobile ? 'white' : bgColor,
          fontSize: '24px',
          fontWeight: 700,
          mixBlendMode: 'exclusion',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title}
      </Stack>
    </Stack>
  );
}

// ================== GRID UTAMA ==================
export default function PaketGrid() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [userPakets, setUserPakets] = useState<UserPaket[]>([]);

  useEffect(() => {
    const fetchUserPakets = async () => {
      try {
        const response = await fetch('http://localhost:3000/user-pakets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data: UserPaket[] = await response.json();
        setUserPakets(data);
      } catch (error) {
        console.error('Error fetching user pakets:', error);
      }
    };

    fetchUserPakets();
  }, []);

  const handleItemClick = (id: string, expired: boolean) => {
    if (!expired) {
      navigate(`/paketku?id=${encodeURIComponent(id)}`);
    }
  };

  const totalPages = Math.ceil(userPakets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = userPakets.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const formatPrice = (price: number) => {
    return Number(price).toLocaleString('id-ID');
  };

  // ✅ Format tanggal ke Indonesia
  const formatDateIndo = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // ✅ Check apakah sudah expired
  const isExpired = (closed_at: string) => {
    return new Date(closed_at) < new Date();
  };

  return (
    <Stack
      justifyContent={'space-between'}
      alignItems={'center'}
      minHeight={'600px'}
      sx={{ width: '100%', alignItems: 'flex-start' }}
    >
      <Grid container spacing={{ xs: 0, lg: 0, sm: 0 }} sx={{ width: '100%' }}>
        {currentItems.map((item) => {
          const expired = item.closed_at ? isExpired(item.closed_at) : false;
          return (
            <Grid
              item
              key={item.id}
              pb={{ xs: '24px' }}
              pl={{ xs: '24px' }}
              pr={{ xs: '24px' }}
              xs={12}
              sm={6}
              md={4}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  cursor: expired ? 'not-allowed' : 'pointer',
                  opacity: expired ? 0.7 : 1,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': expired
                    ? {}
                    : {
                        transform: 'scale(1.03)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                      },
                }}
                onClick={() => handleItemClick(item.id, expired)}
              >
                {item.image ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt={item.name}
                  />
                ) : (
                  <PackageCard title={item.name} />
                )}

                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>

                  {item.closed_at ? (
                    expired ? (
                      <Typography
                        variant="body1"
                        color="error"
                        sx={{ fontWeight: 600, marginTop: 1 }}
                      >
                        Expired: {formatDateIndo(item.closed_at)}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body1"
                        color="warning.main"
                        sx={{ fontWeight: 600, marginTop: 1 }}
                      >
                        Tutup: {formatDateIndo(item.closed_at)}
                      </Typography>
                    )
                  ) : (
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: 700, marginTop: 1 }}
                    >
                      Rp. {formatPrice(item.price)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          sx={{
            width: '100%',
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            '& .MuiPaginationItem-root': {
              color: 'black',
              fontSize: { xs: '14px', sm: '16px' },
              '&.Mui-selected': {
                backgroundColor: '#E74C3C',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#C0392B',
                },
              },
            },
          }}
        />
      )}
    </Stack>
  );
}