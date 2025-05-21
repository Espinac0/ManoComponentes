import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, Paper, IconButton, CircularProgress, Snackbar, Alert, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DiscountIcon from '@mui/icons-material/LocalOffer';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  // State for storing discounted products
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openSpecsDialog, setOpenSpecsDialog] = useState(false);
  
  // Get functions from cart and authentication contexts
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // State to control the carousel
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 4; // Number of items to show at once

  // Function to fetch discounted products from the API
  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        setLoading(true);
        // Get all components
        const response = await axios.get('http://localhost:5000/api/components');
        
        // Filter only those with discount price
        const productsWithDiscount = response.data.filter(product => 
          product.discountPrice && product.discountPrice < product.price
        );
        
        // Calculate discount percentage for each product
        const productsWithPercentage = productsWithDiscount.map(product => {
          const discountPercentage = Math.round((1 - (product.discountPrice / product.price)) * 100);
          return {
            ...product,
            originalPrice: product.price,
            discountPercentage
          };
        });
        
        setDiscountedProducts(productsWithPercentage);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching discounted products:', err);
        setError('Error al cargar los productos con descuento');
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  // Function to advance the carousel
  const handleNext = () => {
    setStartIndex((prevIndex) => 
      (prevIndex + 1) % (discountedProducts.length - itemsToShow + 1) || 0
    );
  };

  // Function to go back in the carousel
  const handlePrev = () => {
    setStartIndex((prevIndex) => 
      prevIndex === 0 ? discountedProducts.length - itemsToShow : prevIndex - 1
    );
  };

  // Autoplay for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [startIndex]);
  
  // Effect to hide cart message after 3 seconds
  useEffect(() => {
    if (showCartMessage) {
      const timer = setTimeout(() => {
        setShowCartMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCartMessage]);
  
  // Function to add a product to the cart
  const handleAddToCart = async (product) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show message indicating login is required
      setCartMessage('Inicia sesión para añadir productos al carrito');
      setShowCartMessage(true);
      return;
    }
    
    // Use context to add to cart
    const success = await addToCart(product);
    
    if (success) {
      // Show confirmation message
      setCartMessage(`${product.name} añadido al carrito`);
      setShowCartMessage(true);
    } else {
      // Show error message
      setCartMessage('Error al añadir al carrito');
      setShowCartMessage(true);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Banner with link to offers page */}
      <Box sx={{ mb: 4, width: '100%' }}>
        <Link to="/ofertas" style={{ display: 'block' }}>
          <img 
            src="/BannerMaño.png" 
            alt="Ofertas Especiales" 
            style={{ 
              width: '100%', 
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>
      </Box>



      {/* Carousel section with offers */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Nuestras mejores ofertas!
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : discountedProducts.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No hay ofertas disponibles en este momento.</Typography>
          </Box>
        ) : (
          <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            {/* Controles del carrusel */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: '50%', left: 0, right: 0, zIndex: 1, transform: 'translateY(-50%)' }}>
              <IconButton 
                onClick={handlePrev} 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.8)', 
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' } 
                }}
                disabled={discountedProducts.length <= itemsToShow}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton 
                onClick={handleNext} 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.8)', 
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' } 
                }}
                disabled={discountedProducts.length <= itemsToShow}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>

            {/* Carousel items */}
            <Grid container spacing={3} sx={{ transition: 'transform 0.5s ease', transform: `translateX(-${startIndex * (100 / itemsToShow)}%)` }}>
              {discountedProducts.map((product) => (
              <Grid item key={product.id} xs={12 / itemsToShow} sx={{ flexShrink: 0 }}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  position: 'relative',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}>
                  {/* Discount label */}
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
                      setSelectedProduct(product);
                      setOpenSpecsDialog(true);
                    }}
                  >
                    <InfoIcon />
                  </IconButton>

                  {/* Etiqueta de descuento */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'error.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      zIndex: 1,
                      boxShadow: 3
                    }}
                  >
                    <Typography variant="body2" component="div" align="center" fontWeight="bold">
                      -{product.discountPercentage}%
                    </Typography>
                  </Box>

                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'contain', p: 2 }}
                  />
                  <CardContent sx={{ flexGrow: 1, pt: 1, pb: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ 
                      fontWeight: 'medium', 
                      minHeight: '2.5em',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: '3em', overflow: 'hidden' }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        {product.originalPrice.toFixed(2)}€
                      </Typography>
                      <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                        {product.discountPrice.toFixed(2)}€
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Tooltip title={isAuthenticated ? "Añadir al carrito" : "Inicia sesión para añadir al carrito"} arrow>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        color="secondary"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => handleAddToCart(product)}
                      >
                        Añadir al carrito
                      </Button>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          </Box>
        )}
      </Box>
      {/* Snackbar to show cart messages */}
      <Snackbar
        open={showCartMessage}
        autoHideDuration={3000}
        onClose={() => setShowCartMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowCartMessage(false)} 
          severity={cartMessage.includes('Error') || cartMessage.includes('Inicia sesión') ? 'warning' : 'success'}
          sx={{ width: '100%' }}
        >
          {cartMessage}
        </Alert>
      </Snackbar>

      {/* Dialog to show product specifications */}
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
        {selectedProduct && (
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
                {selectedProduct.name}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <TableContainer>
                <Table>
                  <TableBody>
                    {selectedProduct.category && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          Categoría
                        </TableCell>
                        <TableCell>{selectedProduct.category}</TableCell>
                      </TableRow>
                    )}
                    {selectedProduct.brand && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          Marca
                        </TableCell>
                        <TableCell>{selectedProduct.brand}</TableCell>
                      </TableRow>
                    )}
                    {selectedProduct.model && (
                      <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                          Modelo
                        </TableCell>
                        <TableCell>{selectedProduct.model}</TableCell>
                      </TableRow>
                    )}
                    {selectedProduct.specs && Object.entries(selectedProduct.specs).map(([key, value]) => {
                      // Translate keys to more user-friendly Spanish terms
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
                      
                      // Buscar coincidencias exactas primero
                      if (keyMappings[key]) {
                        displayKey = keyMappings[key];
                      } else {
                        // Buscar coincidencias parciales
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
                        Precio Original
                      </TableCell>
                      <TableCell>{selectedProduct.originalPrice.toFixed(2)}€</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Precio con Descuento
                      </TableCell>
                      <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                        {selectedProduct.discountPrice.toFixed(2)}€ ({selectedProduct.discountPercentage}% descuento)
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Descripción:
                </Typography>
                <Typography variant="body2">
                  {selectedProduct.description}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<AddShoppingCartIcon />}
                onClick={() => {
                  handleAddToCart(selectedProduct);
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

      {/* Cart message snackbar */}
      {showCartMessage && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: isAuthenticated ? 'success.main' : 'warning.main',
            color: 'white',
            py: 1,
            px: 3,
            borderRadius: 2,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {!isAuthenticated && <LoginIcon />}
          <Typography variant="body2">{cartMessage}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;
