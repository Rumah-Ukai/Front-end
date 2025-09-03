// Buttonslider.tsx
import React, { Dispatch, SetStateAction } from 'react';
import { Stack, IconButton } from '@mui/material';

interface ButtonSliderProps {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

export const Buttonslider: React.FC<ButtonSliderProps> = ({ activeIndex, setActiveIndex, totalPages }) => {

  return (
    <Stack
      gap={5}
      direction='row'
      justifyContent='center'
      alignContent='center'
    >

      {[...Array(totalPages)].map((_, index) => (
        <IconButton
          key={index}
          disableRipple
          sx={{
            alignContent: 'center',
            width: activeIndex === index ? '100px' : '40px',
            height: '40px',
            borderRadius: '30px',
            backgroundColor: activeIndex === index ? '#ff010c' : '#D9D9D9',
            transition: 'width 0.3s ease',
            '&:hover': {
              backgroundColor: activeIndex === index ? '#ff010c' : '#D9D9D9',
            },
          }}
          onClick={() => setActiveIndex(index)}
        >
          {/* {index + 1} */}
        </IconButton>
      ))}
    </Stack>
  );
};
