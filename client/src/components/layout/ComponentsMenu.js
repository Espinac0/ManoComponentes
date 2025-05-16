import React from 'react';
import { useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
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

const ComponentsMenu = ({ open, mainDrawerOpen }) => {
  const navigate = useNavigate();
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open && mainDrawerOpen}
      PaperProps={{
        sx: {
          width: 250,
          position: 'static',
          borderLeft: 1,
          borderColor: 'divider',
          '& .MuiList-root': {
            padding: 0
          }
        }
      }}
      sx={{
        width: 250,
        '& .MuiDrawer-paper': {
          position: 'static'
        }
      }}
    >
      <Box
        sx={{ 
          width: 250,
          bgcolor: 'background.paper'
        }}
        role="presentation"
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Componentes
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
        <List>
          <ListItem sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              cursor: 'pointer',
              '& .MuiListItemText-primary': {
                color: '#dc004e'
              }
            }
          }}>
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

          <ListItem sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              cursor: 'pointer',
              '& .MuiListItemText-primary': {
                color: '#dc004e'
              }
            }
          }}>
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

          <ListItem sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              cursor: 'pointer',
              '& .MuiListItemText-primary': {
                color: '#dc004e'
              }
            }
          }}>
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

          <ListItem sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              cursor: 'pointer',
              '& .MuiListItemText-primary': {
                color: '#dc004e'
              }
            }
          }}>
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

          <ListItem sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              cursor: 'pointer',
              '& .MuiListItemText-primary': {
                color: '#dc004e'
              }
            }
          }}>
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

          <ListItem sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              cursor: 'pointer',
              '& .MuiListItemText-primary': {
                color: '#dc004e'
              }
            }
          }}>
            <ListItemIcon>
              <MemoryIcon />
            </ListItemIcon>
            <ListItemText 
              primary="RAM" 
              primaryTypographyProps={{ 
                fontSize: '1.1rem'
              }}
            />
          </ListItem>

          <ListItem sx={{
            '&:hover': {
              backgroundColor: 'transparent',
              cursor: 'pointer',
              '& .MuiListItemText-primary': {
                color: '#dc004e'
              }
            }
          }}>
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
      </Box>
    </Drawer>
  );
};

export default ComponentsMenu;
