import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CircularProgress, 
  Button 
} from '@mui/material';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ComponentsPage = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleAddToCart = async (component) => {
    if (!isAuthenticated) {
      alert('Inicia sesión para añadir productos al carrito');
      return;
    }
    
    const success = await addToCart(component);
    
    if (success) {
      alert(`${component.name} añadido al carrito`);
    } else {
      alert('Error al añadir al carrito');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Componentes
      </Typography>

      <Grid container spacing={2}>
        {components.map((component) => (
          <Grid item xs={12} sm={6} md={3} key={component._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="160"
                image={component.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={component.name}
                sx={{ objectFit: 'contain', p: 1 }}
              />
              <CardContent sx={{ pt: 1, pb: 1 }}>
                <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium', mb: 0.5, minHeight: '2.5em', wordWrap: 'break-word' }}>
                  {component.name}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {component.discountPrice ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
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
                    <Typography variant="h6">
                      {component.price.toFixed(2)}€
                    </Typography>
                  )}
                </Box>
              </CardContent>
              <Box sx={{ mt: 'auto', p: 1, pt: 0, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="secondary"
                  onClick={() => handleAddToCart(component)}
                >
                  Añadir al carrito
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ComponentsPage;
