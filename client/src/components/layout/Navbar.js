import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
//https://mui.com/material-ui/material-icons/
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

// Componentes personalizados
import MenuLateral from './MenuLateral';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [componentsDrawerOpen, setComponentsDrawerOpen] = useState(false); // Controla la apertura del menú lateral
  const [cartCount, setCartCount] = useState(0);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Función para cerrar los menús al hacer clic fuera
  const handleClickOutside = useCallback((event) => {
    // Verificar si el clic fue fuera del menú
    const isClickOutsideMenu = !event.target.closest('#menu-lateral');
    
    if (componentsDrawerOpen && isClickOutsideMenu) {
      console.log('Clic fuera del menú, cerrando...');
      setComponentsDrawerOpen(false);
    }
  }, [componentsDrawerOpen]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
  
  // Función para actualizar el contador del carrito (definida fuera del useEffect para poder llamarla desde otros lugares)
  const updateCartCount = useCallback(() => {
    // Obtener la clave del carrito según el usuario
    const cartKey = isAuthenticated && userEmail ? `cart_${userEmail}` : 'cart_guest';
    
    // Obtener el carrito usando la clave correcta
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    console.log('Actualizando contador del carrito:', { cartKey, count });
  }, [isAuthenticated, userEmail]);
  
  // Efecto para actualizar el contador del carrito
  useEffect(() => {
    // Actualizar el contador al cargar el componente o cuando cambia el estado de autenticación
    updateCartCount();
    
    // Escuchar el evento personalizado 'cartUpdated'
    window.addEventListener('cartUpdated', updateCartCount);
    
    // Monitorear cambios en localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'cart_guest' || e.key?.startsWith('cart_')) {
        updateCartCount();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Limpiar los listeners al desmontar el componente
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, userEmail, updateCartCount]);
  
  const navigate = useNavigate();
  
  // Función para manejar el clic en el icono del carrito
  const handleCartClick = (event) => {
    setCartAnchorEl(event.currentTarget);
  };
  
  // Función para cerrar el menú del carrito
  const handleCartClose = () => {
    setCartAnchorEl(null);
  };
  
  // Función para navegar a la página del carrito
  const goToCart = () => {
    handleCartClose();
    navigate('/carrito');
  };

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

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    // Prevenir el comportamiento por defecto del formulario
    e.preventDefault();
    
    // Redirigir a la página de búsqueda con la consulta como parámetro
    if (searchQuery.trim()) {
      navigate(`/busqueda?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Limpiar el campo después de la búsqueda
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail('');
    setIsAdmin(false);
    handleClose();
    // Navegar a la página principal y luego recargar para asegurar que la sesión se cierre correctamente
    navigate('/', { replace: true });
    // Recargar la página después de un breve retraso para asegurar que la navegación se complete
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#ffffff', boxShadow: 2, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Box component="img" src="/logo.png" alt="Logo" sx={{ height: 85, mr: 2 }} />
          </Box>

          <Box
            onClick={() => setComponentsDrawerOpen(!componentsDrawerOpen)}
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
                fontWeight: componentsDrawerOpen ? 700 : 400,
                color: componentsDrawerOpen ? '#000000' : 'inherit'
              }}
            >
              Todos los productos
            </Typography>
          </Box>

          {/* Barra de búsqueda */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              mx: 2
            }}
          >
            <TextField
              size="small"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: { xs: '100%', sm: '60%', md: '50%' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    backgroundColor: '#eeeeee',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      edge="end"
                    >
                      <Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>×</Box>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box sx={{ flexGrow: 0 }} />
          
          {/* Icono del carrito de compras */}
          <IconButton
            size="large"
            aria-label="carrito de compras"
            aria-controls="menu-cart"
            aria-haspopup="true"
            onClick={handleCartClick}
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          
          {/* Menú desplegable del carrito */}
          <Menu
            id="menu-cart"
            anchorEl={cartAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(cartAnchorEl)}
            onClose={handleCartClose}
            sx={{ mt: 1 }}
          >
            <MenuItem onClick={goToCart}>Ver carrito</MenuItem>
          </Menu>
          
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
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mt: 1 }}
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
      {/* Toolbar adicional para compensar el espacio de la AppBar fija */}
      <Toolbar />
      {/* Menú lateral */}
      <MenuLateral open={componentsDrawerOpen} mainDrawerOpen={true} />
    </Box>
  );
};

export default Navbar;
