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
  Button, 
  CardActions, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow,
  Snackbar,
  Alert
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define predefined categories
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
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [openSpecsDialog, setOpenSpecsDialog] = useState(false);
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Number of components to show per page in the carousel
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
  
  useEffect(() => {
    if (showCartMessage) {
      const timer = setTimeout(() => {
        setShowCartMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCartMessage]);

  const handleAddToCart = async (component) => {
    if (!isAuthenticated) {
      setCartMessage('Inicia sesión para añadir productos al carrito');
      setShowCartMessage(true);
      return;
    }
    
    const success = await addToCart(component);
    
    if (success) {
      setCartMessage(`${component.name} añadido al carrito`);
      setShowCartMessage(true);
    } else {
      setCartMessage('Error al añadir al carrito');
      setShowCartMessage(true);
    }
  };

  const determineCategory = (component) => {
    const name = (component.name || '').toLowerCase();
    const category = (component.category || '').toLowerCase();
    
    if (name.includes('placa') || name.includes('motherboard') || category.includes('placa') || category.includes('motherboard')) {
      return 'motherboard';
    }
    if (name.includes('procesador') || name.includes('cpu') || name.includes('ryzen') || name.includes('intel') || category.includes('procesador') || category.includes('cpu')) {
      return 'cpu';
    }
    if (name.includes('tarjeta') || name.includes('gráfica') || name.includes('grafica') || name.includes('gpu') || name.includes('geforce') || name.includes('radeon')) {
      return 'gpu';
    }
    if (name.includes('memoria') || name.includes('ram')) {
      return 'ram';
    }
    if (name.includes('disco') || name.includes('ssd') || name.includes('hdd') || name.includes('nvme') || name.includes('almacenamiento')) {
      return 'storage';
    }
    if (name.includes('refrigeración') || name.includes('refrigeracion') || name.includes('ventilador') || name.includes('disipador') || name.includes('cooler')) {
      return 'cooling';
    }
    if (name.includes('fuente') || name.includes('alimentación') || name.includes('alimentacion') || name.includes('psu')) {
      return 'psu';
    }
    
    return Object.keys(categories)[0];
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

  // Group components by category
  const componentsByCategory = {};
  components.forEach(component => {
    const category = determineCategory(component);
    if (!componentsByCategory[category]) {
      componentsByCategory[category] = [];
    }
    componentsByCategory[category].push(component);
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Snackbar
        open={showCartMessage}
        autoHideDuration={3000}
        onClose={() => setShowCartMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={cartMessage.includes('Inicia sesión') ? 'warning' : 'success'} 
          sx={{ width: '100%' }}
          onClose={() => setShowCartMessage(false)}
        >
          {cartMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Componentes
      </Typography>

      {Object.keys(componentsByCategory).map(category => {
        const items = componentsByCategory[category];
        
        if (items.length === 0) return null;
        
        const startIndex = carouselIndexes[category] || 0;
        const hasMoreItems = startIndex + maxItemsPerPage < items.length;
        const hasPreviousItems = startIndex > 0;
        
        const handleNext = () => {
          setCarouselIndexes({
            ...carouselIndexes,
            [category]: startIndex + maxItemsPerPage
          });
        };
        
        const handlePrevious = () => {
          setCarouselIndexes({
            ...carouselIndexes,
            [category]: Math.max(0, startIndex - maxItemsPerPage)
          });
        };
        
        const visibleItems = items.slice(startIndex, startIndex + maxItemsPerPage);
        
        return (
          <Box key={category} sx={{ mb: 6 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
              {categories[category] || 'Otros Componentes'}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton 
                onClick={handlePrevious} 
                disabled={!hasPreviousItems}
                color="primary"
                size="small"
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton 
                onClick={handleNext} 
                disabled={!hasMoreItems}
                color="primary"
                size="small"
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={2}>
              {visibleItems.map((component) => (
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
                    <Box sx={{ mt: 'auto', p: 1, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => {
                          setSelectedComponent(component);
                          setOpenSpecsDialog(true);
                        }}
                        startIcon={<InfoIcon />}
                        sx={{ color: 'black' }}
                      >
                        Detalles
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="secondary"
                        onClick={() => handleAddToCart(component)}
                        startIcon={<AddShoppingCartIcon />}
                      >
                        Añadir
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
      
      <Dialog
        open={openSpecsDialog}
        onClose={() => setOpenSpecsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedComponent && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedComponent.name}</Typography>
              <IconButton onClick={() => setOpenSpecsDialog(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={selectedComponent.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={selectedComponent.name}
                      sx={{ 
                        width: '100%', 
                        objectFit: 'contain',
                        borderRadius: 1,
                        mb: 2
                      }}
                    />
                    {selectedComponent.discountPrice && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          backgroundColor: 'error.main',
                          color: 'white',
                          py: 0.5,
                          px: 1,
                          borderRadius: 1,
                          fontWeight: 'bold'
                        }}
                      >
                        {Math.round((1 - selectedComponent.discountPrice / selectedComponent.price) * 100)}% OFF
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {selectedComponent.discountPrice ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                          {selectedComponent.discountPrice.toFixed(2)}€
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {selectedComponent.price.toFixed(2)}€
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="h5">
                        {selectedComponent.price.toFixed(2)}€
                      </Typography>
                    )}
                  </Box>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => {
                      handleAddToCart(selectedComponent);
                      setOpenSpecsDialog(false);
                    }}
                    disabled={selectedComponent.stock <= 0}
                  >
                    Añadir al carrito
                  </Button>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" gutterBottom>
                    Especificaciones
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {selectedComponent.category && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Categoría
                            </TableCell>
                            <TableCell>{getCategoryName(determineCategory(selectedComponent))}</TableCell>
                          </TableRow>
                        )}
                        {selectedComponent.brand && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Marca
                            </TableCell>
                            <TableCell>{selectedComponent.brand}</TableCell>
                          </TableRow>
                        )}
                        {selectedComponent.model && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Modelo
                            </TableCell>
                            <TableCell>{selectedComponent.model}</TableCell>
                          </TableRow>
                        )}
                        {selectedComponent.stock !== undefined && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Stock
                            </TableCell>
                            <TableCell>
                              {selectedComponent.stock > 0 ? `${selectedComponent.stock} unidades disponibles` : 'Agotado'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {selectedComponent.description && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Descripción:
                      </Typography>
                      <Typography variant="body2">
                        {selectedComponent.description}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button 
                variant="outlined" 
                onClick={() => setOpenSpecsDialog(false)}
                startIcon={<CloseIcon />}
              >
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

// Function to get the readable name of the category
const getCategoryName = (category) => {
  return categories[category] || 'Otros Componentes';
};

export default ComponentsPage;
