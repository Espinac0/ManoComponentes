import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, CircularProgress, Button, CardActions } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

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
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

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

      {Object.entries(groupedComponents).map(([category, items]) => (
        // Solo mostrar categorías que tengan componentes
        items.length > 0 ? (
          <Box key={category} sx={{ mb: 6 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
              {getCategoryName(category)}
            </Typography>
            
            <Grid container spacing={3}>
              {items.map((component) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={component._id}>
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
                      <Typography variant="h6" color="error" sx={{ fontWeight: 'bold', mt: 1 }}>
                        {component.price.toFixed(2)}€
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => handleAddToCart(component)}
                        fullWidth
                      >
                        Añadir al carrito
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null
      ))}
    </Container>
  );
};

// Función para obtener el nombre legible de la categoría
const getCategoryName = (category) => {
  // Usar las categorías predefinidas que ya tenemos en el componente
  return categories[category] || 'Otros Componentes';
};

export default ComponentsPage;
