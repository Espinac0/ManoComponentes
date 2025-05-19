import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, CircularProgress, Button, CardActions, IconButton, Tooltip } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginIcon from '@mui/icons-material/Login';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Definir categorías predefinidas
const categories = {
  'gpu': 'Tarjetas Gráficas',
  'cpu': 'Procesadores',
  'motherboard': 'Placas Base',
  'ram': 'Memoria RAM',
  'storage': 'Discos Duros',
  'cooling': 'Refrigeración',
  'psu': 'Fuentes de Alimentación'
};

const ComponentsPage = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [showCartMessage, setShowCartMessage] = useState(false);
  // Estados para el carrusel por categoría
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Número de componentes a mostrar por página en el carrusel
  const maxItemsPerPage = 4;

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/components');
        setComponents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching components:', err);
        setError('Error al cargar los componentes. Por favor, inténtelo de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);
  
  // Efecto para ocultar el mensaje del carrito después de 3 segundos
  useEffect(() => {
    if (showCartMessage) {
      const timer = setTimeout(() => {
        setShowCartMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCartMessage]);

  // Función para añadir un producto al carrito usando el contexto
  const handleAddToCart = async (component) => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      // Mostrar mensaje indicando que debe iniciar sesión
      setCartMessage('Inicia sesión para añadir productos al carrito');
      setShowCartMessage(true);
      return;
    }
    
    // Usar el contexto para añadir al carrito
    const success = await addToCart(component);
    
    if (success) {
      // Mostrar mensaje de confirmación
      setCartMessage(`${component.name} añadido al carrito`);
      setShowCartMessage(true);
    } else {
      // Mostrar mensaje de error
      setCartMessage('Error al añadir al carrito');
      setShowCartMessage(true);
    }
  };

  // Usar las categorías predefinidas definidas fuera del componente

  // Función para determinar la categoría de un componente
  const determineCategory = (component) => {
    // Verificar el nombre y la categoría para determinar el tipo
    const name = (component.name || '').toLowerCase();
    const category = (component.category || '').toLowerCase();
    
    if (name.includes('placa') || name.includes('motherboard') || category.includes('placa') || category.includes('motherboard')) {
      return 'motherboard';
    }
    if (name.includes('procesador') || name.includes('cpu') || name.includes('ryzen') || name.includes('intel') || category.includes('procesador') || category.includes('cpu')) {
      return 'cpu';
    }
    if (name.includes('gráfica') || name.includes('gpu') || name.includes('geforce') || name.includes('radeon') || category.includes('gráfica') || category.includes('gpu')) {
      return 'gpu';
    }
    if (name.includes('ram') || name.includes('memoria') || category.includes('ram') || category.includes('memoria')) {
      return 'ram';
    }
    if (name.includes('disco') || name.includes('ssd') || name.includes('hdd') || name.includes('storage') || category.includes('disco') || category.includes('almacenamiento')) {
      return 'storage';
    }
    if (name.includes('refrigera') || name.includes('cooling') || name.includes('ventilador') || name.includes('fan') || category.includes('refrigera') || category.includes('cooling')) {
      return 'cooling';
    }
    if (name.includes('fuente') || name.includes('alimentación') || name.includes('psu') || name.includes('power') || category.includes('fuente') || category.includes('alimentación')) {
      return 'psu';
    }
    
    return 'other';
  };
  
  // Crear un objeto para cada categoría, incluso si está vacía
  const groupedComponents = Object.keys(categories).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});
  
  // Asignar cada componente a su categoría
  components.forEach(component => {
    const categoryKey = determineCategory(component);
    if (groupedComponents[categoryKey]) {
      groupedComponents[categoryKey].push(component);
    } else {
      if (!groupedComponents['other']) {
        groupedComponents['other'] = [];
      }
      groupedComponents['other'].push(component);
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {/* Notificación de añadido al carrito */}
      {showCartMessage && (
        <Box
          sx={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: 'secondary.main',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.3s, fadeOut 0.3s 2.7s',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' }
            },
            '@keyframes fadeOut': {
              '0%': { opacity: 1, transform: 'translateY(0)' },
              '100%': { opacity: 0, transform: 'translateY(-20px)' }
            }
          }}
        >
          <Typography variant="body1">{cartMessage}</Typography>
        </Box>
      )}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Todos los Componentes
      </Typography>

      {Object.entries(groupedComponents).map(([category, items]) => {
        // Solo mostrar categorías que tengan componentes
        if (items.length === 0) return null;
        
        // Obtener el índice actual para esta categoría (o 0 si no existe)
        const startIndex = carouselIndexes[category] || 0;
        const hasMoreItems = items.length > startIndex + maxItemsPerPage;
        const hasPreviousItems = startIndex > 0;
        
        // Función para avanzar al siguiente grupo de componentes
        const handleNext = () => {
          if (hasMoreItems) {
            setCarouselIndexes({
              ...carouselIndexes,
              [category]: startIndex + maxItemsPerPage
            });
          }
        };
        
        // Función para retroceder al grupo anterior de componentes
        const handlePrevious = () => {
          if (hasPreviousItems) {
            setCarouselIndexes({
              ...carouselIndexes,
              [category]: Math.max(0, startIndex - maxItemsPerPage)
            });
          }
        };
        
        // Obtener solo los componentes que se mostrarán en la página actual
        const visibleItems = items.slice(startIndex, startIndex + maxItemsPerPage);
        
        return (
          <Box key={category} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                {getCategoryName(category)}
              </Typography>
              <Box>
                <IconButton 
                  onClick={handlePrevious} 
                  disabled={!hasPreviousItems}
                  color="secondary"
                  sx={{ opacity: hasPreviousItems ? 1 : 0.5 }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton 
                  onClick={handleNext} 
                  disabled={!hasMoreItems}
                  color="secondary"
                  sx={{ opacity: hasMoreItems ? 1 : 0.5 }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              {visibleItems.map((component) => (
                <Grid item xs={12} sm={6} md={6} lg={3} key={component._id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={component.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={component.name}
                      sx={{ objectFit: 'contain', p: 2 }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'medium', height: '3em', overflow: 'hidden' }}>
                        {component.name}
                      </Typography>
                      {component.discountPrice ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                            {component.discountPrice.toFixed(2)}€
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textDecoration: 'line-through', 
                              color: 'text.secondary',
                              ml: 1
                            }}
                          >
                            {component.price.toFixed(2)}€
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                          {component.price.toFixed(2)}€
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Tooltip title={isAuthenticated ? "Añadir al carrito" : "Inicia sesión para añadir al carrito"} arrow>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => handleAddToCart(component)}
                          fullWidth
                        >
                          Añadir al carrito
                        </Button>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Container>
  );
};

// Función para obtener el nombre legible de la categoría
const getCategoryName = (category) => {
  // Usar las categorías predefinidas que ya tenemos en el componente
  return categories[category] || 'Otros Componentes';
};

export default ComponentsPage;
