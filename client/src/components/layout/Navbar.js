import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
//https://mui.com/material-ui/material-icons/
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRight from '@mui/icons-material/ChevronRight';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';

// Componentes personalizados
import ComponentsMenu from './ComponentsMenu';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [mainDrawerOpen, setMainDrawerOpen] = useState(false);
  const [componentsDrawerOpen, setComponentsDrawerOpen] = useState(false);

  // Función para cerrar los menús al hacer clic fuera
  const handleClickOutside = useCallback((event) => {
    if (mainDrawerOpen && !event.target.closest('.MuiDrawer-root')) {
      setMainDrawerOpen(false);
      setComponentsDrawerOpen(false);
    }
  }, [mainDrawerOpen]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
      
      // Verificar si el usuario es admin
      const checkAdmin = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              'x-auth-token': token
            }
          });
          console.log('Respuesta de /auth/me:', response.data);
          console.log('Role del usuario:', response.data.role);
          setIsAdmin(response.data.role === 'admin');
          console.log('isAdmin:', response.data.role === 'admin');
        } catch (err) {
          console.error('Error al verificar rol de usuario:', err);
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            setIsAuthenticated(false);
            setUserEmail('');
            setIsAdmin(false);
          }
        }
      };
      
      checkAdmin();
    } else {
      setIsAuthenticated(false);
      setUserEmail('');
      setIsAdmin(false);
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail('');
    setIsAdmin(false);
    handleClose();
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
      <AppBar position="static" sx={{ color: 'text.primary' }}>
        <Toolbar>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Box component="img" src="/logo.png" alt="Logo" sx={{ height: 85, mr: 2 }} />
          </Box>

          <Box
            onClick={() => setMainDrawerOpen(!mainDrawerOpen)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              ml: 2,
              cursor: 'pointer',
              '&:hover': {
                '& .menu-text': {
                  color: '#dc004e'
                }
              }
            }}
          >
            <MenuIcon sx={{ mr: 1 }} />
            <Typography 
              className="menu-text"
              sx={{ 
                fontWeight: mainDrawerOpen ? 700 : 400,
                color: mainDrawerOpen ? '#000000' : 'inherit'
              }}
            >
              Todos los productos
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          
          {isAuthenticated ? (
            <div style={{ marginLeft: 'auto' }}>
              {isAdmin && (
                <Button
                  component={Link}
                  to="/admin"
                  sx={{ 
                    color: 'white', 
                    mr: 2,
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }}
                >
                  Panel Admin
                </Button>
              )}
              <IconButton
                size="large"
                aria-label="cuenta del usuario"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {userEmail}
                </Typography>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </div>
          ) : (
            <div style={{ marginLeft: 'auto' }}>
              <Button sx={{ color: 'text.primary' }} component={Link} to="/login">
                Iniciar Sesión
              </Button>
              <Button sx={{ color: 'text.primary' }} component={Link} to="/register">
                Registrarse
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ 
        display: mainDrawerOpen ? 'flex' : 'none',
        position: 'absolute',
        top: '85px',
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 100,
        pointerEvents: mainDrawerOpen ? 'auto' : 'none'
      }}>
        {/* Drawer principal */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={mainDrawerOpen}
          onClose={() => {
            setMainDrawerOpen(false);
            setComponentsDrawerOpen(false);
          }}
          PaperProps={{
            sx: {
              width: 250,
              position: 'static',
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
          <Box role="presentation">
            <List>
              <ListItem 
                onClick={() => setComponentsDrawerOpen(!componentsDrawerOpen)}
                sx={{
                  color: componentsDrawerOpen ? '#000000' : 'inherit',
                  fontWeight: componentsDrawerOpen ? 700 : 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#dc004e'
                  }
                }}
              >
                <ListItemIcon>
                  <DeveloperBoardIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Componentes" 
                  primaryTypographyProps={{ 
                    fontSize: '1.1rem',
                    fontWeight: componentsDrawerOpen ? 700 : 400
                  }}
                />
                <ChevronRight />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Menú de componentes */}
        <ComponentsMenu open={componentsDrawerOpen} mainDrawerOpen={mainDrawerOpen} />
      </Box>
    </Box>
  );
};

export default Navbar;
