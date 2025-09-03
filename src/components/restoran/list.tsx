import { useEffect, useState, forwardRef } from 'react';
import { List, ListItem, Stack, Typography } from '@mui/material';
import axios from 'axios';

interface MenuListProps {
  restaurantName: string;
  menuType: 'makanan' | 'minuman';
  Height: number;
}

interface RestaurantData {
  makanan: string;
  minuman: string;
}

const MenuList = forwardRef<HTMLDivElement, MenuListProps>(({ restaurantName, menuType }, ref) => {
  const [menuItems, setMenuItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<RestaurantData>(`https://tripselbe.fly.dev/restoran/${restaurantName}`);
        const data = response.data;
        const items = data[menuType].split(',').map(item => item.trim());
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchData();
  }, [restaurantName, menuType]);

  return (
    <Stack height={'auto'} width={'100%'} border={'2.5px solid var(--Primary-Color---Red-3, #FF010C)'} borderRadius={'40px'} sx={{ backgroundColor: '#EC000C' }} >
      <Typography fontSize={'42px'} fontWeight={700} textAlign={'center'} color={'#FFF'} paddingTop={'20px'} paddingBottom={'20px'}>
      {menuType.charAt(0).toUpperCase() + menuType.slice(1)}
      </Typography>
      <Stack justifyContent={'center'} alignItems={'center'} height={'100%'} sx={{ backgroundColor: 'white' }} paddingTop={'60px'} paddingBottom={'60px'} borderRadius={'0 0 40px 40px'}  ref={ref}>
        <List sx={{ justifyContent: 'center', alignItems: 'center' }} >
          {menuItems.map((item, index) => (
            <ListItem key={index} sx={{ justifyContent: 'center', alignItems: 'center' }} >
              <Typography fontSize={'38px'} fontWeight={400} color={'#04214C'} textAlign={'center'}>
                {item}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Stack>
  );
});

export default MenuList;
