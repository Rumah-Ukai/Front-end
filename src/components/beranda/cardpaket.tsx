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
  Dialog,
  DialogContent,
  Button,
} from '@mui/material';

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

// ================== GLOBAL COLOR POOL ==================
const colorPool = [
  '#E74C3C',
  '#3498DB',
  '#2ECC71',
  '#9B59B6',
  '#F39C12',
  '#1ABC9C',
  '#34495E',
];
// Shuffle untuk randomisasi awal
const shuffledColors = [...colorPool].sort(() => Math.random() - 0.5);
let colorIndex = 0;

// ambil warna unik
const getUniqueColor = () => {
  if (colorIndex >= shuffledColors.length) {
    // kalau sudah habis, reset lagi (tidak akan ada duplikat sebelum cycle selesai)
    colorIndex = 0;
  }
  return shuffledColors[colorIndex++];
};

// ================== SHAPE CARD ==================
interface PackageCardProps {
  title: string;
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

  // warna unik dari pool
  const [bgColor] = useState(getUniqueColor);

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

        let shapeEl;
        const isFilled = Math.random() > 0.5;

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
interface PaketItem {
  id: string;
  name: string;
  price: string;
  image?: string;
  detail1?: string;
  detail2?: string;
  detail3?: string;
  detail4?: string;
  detail5?: string;
}

export default function PaketGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [items, setItems] = useState<PaketItem[]>([]);
  const [userPakets, setUserPakets] = useState<string[]>([]);
  const [selectedPaket, setSelectedPaket] = useState<PaketItem | null>(null);

  useEffect(() => {
    const fetchPakets = async () => {
      try {
        const response = await fetch('http://localhost:3000/pakets');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching pakets:', error);
      }
    };

    const fetchUserPakets = async () => {
      try {
        const response = await fetch('http://localhost:3000/user-pakets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data: { id: string }[] = await response.json();
        setUserPakets(data.map((p) => p.id));
      } catch (error) {
        console.error('Error fetching user pakets:', error);
      }
    };

    fetchPakets();
    fetchUserPakets();
  }, []);

  const filteredItems = items.filter((item) => !userPakets.includes(item.id));

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const formatPrice = (price: string) => {
    return Number(price).toLocaleString('id-ID');
  };

  return (
    <Stack sx={{ width: '100%', alignItems: 'flex-start' }}>
      <Grid container spacing={2} sx={{ width: '100%' }}>
        {currentItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                },
              }}
              onClick={() => setSelectedPaket(item)}
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
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.name}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 700, mt: 1 }}
                >
                  Rp. {formatPrice(item.price)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          sx={{ mt: 4, alignSelf: 'center' }}
        />
      )}

      {/* Popup Detail */}
      <Dialog
        open={!!selectedPaket}
        onClose={() => setSelectedPaket(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedPaket && (
          <DialogContent sx={{ borderRadius: '60px' }}>
            <Card elevation={0}>
              {selectedPaket.image ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={selectedPaket.image}
                  alt={selectedPaket.name}
                />
              ) : (
                <PackageCard title={selectedPaket.name} />
              )}
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {selectedPaket.name}
                </Typography>
                {[1, 2, 3, 4, 5].map((n) => {
                  const key = `detail${n}` as keyof PaketItem;
                  return (
                    selectedPaket[key] && (
                      <Typography key={n} variant="body1" sx={{ mb: 1 }}>
                        • {selectedPaket[key]}
                      </Typography>
                    )
                  );
                })}
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 'bold', mt: 2 }}
                >
                  Rp. {formatPrice(selectedPaket.price)}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                >
                  Beli
                </Button>
              </CardContent>
            </Card>
          </DialogContent>
        )}
      </Dialog>
    </Stack>
  );
}
