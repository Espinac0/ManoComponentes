import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, CircularProgress, Button, CardActions, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginIcon from '@mui/icons-material/Login';
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
  // States for carousel by category
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
  
  // Effect to hide cart message after 3 seconds
  useEffect(() => {
    if (showCartMessage) {
      const timer = setTimeout(() => {
        setShowCartMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCartMessage]);

  // Function to add a product to cart using context
  const handleAddToCart = async (component) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show message indicating login is required
      setCartMessage('Inicia sesión para añadir productos al carrito');
      setShowCartMessage(true);
      return;
    }
    
    // Use context to add to cart
    const success = await addToCart(component);
    
    if (success) {
      // Show confirmation message
      setCartMessage(`${component.name} añadido al carrito`);
      setShowCartMessage(true);
    } else {
      // Show error message
      setCartMessage('Error al añadir al carrito');
      setShowCartMessage(true);
    }
  };

  // Usar las categorías predefinidas definidas fuera del componente

  // Function to determine the category of a component
  const determineCategory = (component) => {
    // Check name and category to determine the type
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
        // Only show categories that have components
        if (items.length === 0) return null;
        
        // Get current index for this category
        const startIndex = carouselIndexes[category] || 0;
        const hasMoreItems = items.length > startIndex + maxItemsPerPage;
        const hasPreviousItems = startIndex > 0;
        
        // Function to advance to next group of components
        const handleNext = () => {
          if (hasMoreItems) {
            setCarouselIndexes({
              ...carouselIndexes,
              [category]: startIndex + maxItemsPerPage
            });
          }
        };
        
        // Function to go back to previous group of components
        const handlePrevious = () => {
          if (hasPreviousItems) {
            setCarouselIndexes({
              ...carouselIndexes,
              [category]: Math.max(0, startIndex - maxItemsPerPage)
            });
          }
        };
        
        // Get only the components that will be shown on the current page
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
                      },
                      position: 'relative'
                    }}
                  >
                    {/* Info button */}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        color: 'primary.dark',
                        zIndex: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,1)',
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComponent(component);
                        setOpenSpecsDialog(true);
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                    
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
      
      {/* Dialog to show component specifications */}
      <Dialog
        open={openSpecsDialog}
        onClose={() => setOpenSpecsDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            pt: 5 // Add more space at the top
          }
        }}
      >
        {selectedComponent && (
          <>
            {/* Close button positioned absolutely at top right */}
            <IconButton 
              onClick={() => setOpenSpecsDialog(false)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)'
                },
                zIndex: 1
              }}
            >
              <CloseIcon />
            </IconButton>
            
            <DialogTitle sx={{ textAlign: 'center', pt: 0 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {selectedComponent.name}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                        {selectedComponent.specs && Object.entries(selectedComponent.specs).map(([key, value]) => {
                          // Translate keys to more user-friendly terms
                          let displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                          
                          // Mapping of technical terms to more user-friendly terms
                          const keyMappings = {
                            'Form factor': 'Forma',
                            'Form_factor': 'Forma',
                            'Chipset': 'Chipset',
                            'Ram_slots': 'Huecos de RAM',
                            'Max_ram': 'RAM máxima',
                            'Max ram': 'RAM máxima',
                            'Socket': 'Socket',
                            'Cores': 'Núcleos',
                            'Threads': 'Hilos',
                            'Clock speed': 'Velocidad',
                            'Clock_speed': 'Velocidad',
                            'Memory type': 'Tipo de memoria',
                            'Memory_type': 'Tipo de memoria',
                            'Capacity': 'Capacidad',
                            'Interface': 'Interfaz',
                            'Rpm': 'RPM',
                            'Cache': 'Caché',
                            'Tdp': 'TDP',
                            'Wattage': 'Potencia',
                            'Efficiency': 'Eficiencia',
                            'Size': 'Tamaño',
                            'Type': 'Tipo',
                            'Fan size': 'Tamaño del ventilador',
                            'Fan_size': 'Tamaño del ventilador'
                          };
                          
                          // Look for exact matches first
                          if (keyMappings[key]) {
                            displayKey = keyMappings[key];
                          } else {
                            // Look for partial matches
                            Object.keys(keyMappings).forEach(mappingKey => {
                              if (key.toLowerCase().includes(mappingKey.toLowerCase())) {
                                displayKey = keyMappings[mappingKey];
                              }
                            });
                          }
                          
                          return (
                            <TableRow key={key}>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                {displayKey}
                              </TableCell>
                              <TableCell>{value}</TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Precio
                          </TableCell>
                          <TableCell>
                            {selectedComponent.discountPrice ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" color="error.main" sx={{ fontWeight: 'bold' }}>
                                  {selectedComponent.discountPrice.toFixed(2)}€
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                  {selectedComponent.price.toFixed(2)}€
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body1">
                                {selectedComponent.price.toFixed(2)}€
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
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
                variant="contained" 
                color="secondary" 
                startIcon={<AddShoppingCartIcon />}
                onClick={() => {
                  handleAddToCart(selectedComponent);
                  setOpenSpecsDialog(false);
                }}
                sx={{ minWidth: '200px' }}
              >
                Añadir al carrito
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
  // Use the predefined categories we already have in the component
  return categories[category] || 'Otros Componentes';
};

export default ComponentsPage;
