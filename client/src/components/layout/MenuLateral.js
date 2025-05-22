import React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Iconos
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LaptopIcon from '@mui/icons-material/Laptop';
import DevicesIcon from '@mui/icons-material/Devices';
import { useTheme } from '@mui/material/styles';

const MenuLateral = ({ open, mainDrawerOpen }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  console.log('MenuLateral render:', { open, mainDrawerOpen });
  return (
    <Box
      id="menu-lateral"
      sx={{
        width: 250,
        position: 'fixed',
        top: '64px',
        left: '0px',
        height: 'calc(100vh - 64px)',
        backgroundColor: 'background.paper',
        borderLeft: 1,
        borderColor: 'divider',
        overflowY: 'auto',
        zIndex: 1200,
        boxShadow: theme.shadows[5],
        display: open ? 'block' : 'none',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.05)',
        },
        paddingTop: '20px' // Add more padding at the top of the drawer
      }}
    >
      <Box
        sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        role="presentation"
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Menú
          </Typography>
          <Typography 
            onClick={() => navigate('/componentes')}
            sx={{ 
              textDecoration: 'underline', 
              cursor: 'pointer',
              '&:hover': {
                color: '#dc004e'
              }
            }}
          >
            Ver todo
          </Typography>
        </Box>
        <List sx={{ mt: 2 }}>
          <ListItem 
            onClick={() => navigate('/placas-base')}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '& .MuiListItemText-primary': {
                  color: '#dc004e'
                }
              }
            }}
          >
            <ListItemIcon>
              <DeveloperBoardIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Placas Base" 
              primaryTypographyProps={{ 
                fontSize: '1.1rem'
              }}
            />
          </ListItem>

          <ListItem 
            onClick={() => navigate('/graficas')}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '& .MuiListItemText-primary': {
                  color: '#dc004e'
                }
              }
            }}
          >
            <ListItemIcon>
              <MemoryIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Tarjetas Gráficas" 
              primaryTypographyProps={{ 
                fontSize: '1.1rem'
              }}
            />
          </ListItem>

          <ListItem 
            onClick={() => navigate('/procesadores')}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '& .MuiListItemText-primary': {
                  color: '#dc004e'
                }
              }
            }}
          >
            <ListItemIcon>
              <MemoryIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Procesadores" 
              primaryTypographyProps={{ 
                fontSize: '1.1rem'
              }}
            />
          </ListItem>

          <ListItem 
            onClick={() => navigate('/discos-duros')}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '& .MuiListItemText-primary': {
                  color: '#dc004e'
                }
              }
            }}
          >
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Discos Duros" 
              primaryTypographyProps={{ 
                fontSize: '1.1rem'
              }}
            />
          </ListItem>

          <ListItem 
            onClick={() => navigate('/refrigeracion')}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '& .MuiListItemText-primary': {
                  color: '#dc004e'
                }
              }
            }}
          >
            <ListItemIcon>
              <AcUnitIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Refrigeración" 
              primaryTypographyProps={{ 
                fontSize: '1.1rem'
              }}
            />
          </ListItem>

          <ListItem 
            onClick={() => navigate('/ram')}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '& .MuiListItemText-primary': {
                  color: '#dc004e'
                }
              }
            }}
          >
            <ListItemIcon>
              <MemoryIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Memorias RAM" 
              primaryTypographyProps={{ 
                fontSize: '1.1rem'
              }}
            />
          </ListItem>

          <ListItem 
            onClick={() => navigate('/fuentes-alimentacion')}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '& .MuiListItemText-primary': {
                  color: '#dc004e'
                }
              }
            }}
          >
            <ListItemIcon>
              <ElectricBoltIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Fuentes de Alimentación" 
              primaryTypographyProps={{ 
                fontSize: '1.1rem'
              }}
            />
          </ListItem>
        </List>

        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Ordenadores
          </Typography>
          <Typography 
            onClick={() => navigate('/ordenadores')}
            sx={{ 
              textDecoration: 'underline', 
              cursor: 'pointer',
              '&:hover': {
                color: '#dc004e'
              }
            }}
          >
            Ver todo
          </Typography>
        </Box>
        <List sx={{ mt: 2 }}>
          <ListItem 
            onClick={() => navigate('/portatiles')}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '& .MuiListItemText-primary': {
                  color: '#dc004e'
                }
              }
            }}
          >
            <ListItemIcon>
              <LaptopIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Portátiles" 
              primaryTypographyProps={{ 
                fontSize: '1.1rem'
              }}
            />
          </ListItem>

          <ListItem 
            onClick={() => navigate('/sobremesa')}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '& .MuiListItemText-primary': {
                  color: '#dc004e'
                }
              }
            }}
          >
            <ListItemIcon>
              <DevicesIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Sobremesa" 
              primaryTypographyProps={{ 
                fontSize: '1.1rem'
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default MenuLateral;
