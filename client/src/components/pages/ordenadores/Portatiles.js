import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, CircularProgress, Snackbar, Alert, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableRow, IconButton, CardActions, Paper } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import axios from 'axios';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

const Portatiles = () => {
  // Estado para almacenar los productos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openSpecsDialog, setOpenSpecsDialog] = useState(false);
  
  // Obtener funciones del contexto del carrito y autenticación
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Función para obtener los portátiles de la API
  useEffect(() => {
    const fetchPortatiles = async () => {
      try {
        setLoading(true);
        // Obtener todos los ordenadores
        const response = await axios.get('http://localhost:5000/api/computers');
        
        console.log('Todos los ordenadores:', response.data);
        
        // Filtrar portátiles
        const portatiles = response.data.filter(product => {
          return product.type === 'Laptop' || product.type === 'Portátil' || 
                 (product.name && (
                   product.name.toLowerCase().includes('portátil') ||
                   product.name.toLowerCase().includes('portatil') ||
                   product.name.toLowerCase().includes('laptop') ||
                   product.name.toLowerCase().includes('notebook')
                 ));
        });
        
        console.log('Portátiles encontrados:', portatiles);
        setProducts(portatiles);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los portátiles:', err);
        setError('Error al cargar los portátiles');
        setLoading(false);
      }
    };

    fetchPortatiles();
  }, []);

  // Función para añadir un producto al carrito
  const handleAddToCart = (product) => {
    if (isAuthenticated) {
      // Añadir al carrito
      addToCart(product);
      // Mostrar mensaje de éxito
      setCartMessage(`${product.name} añadido al carrito`);
      setShowCartMessage(true);
    } else {
      // Mostrar mensaje de error
      setCartMessage('Debes iniciar sesión para añadir productos al carrito');
      setShowCartMessage(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Portátiles
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Descubre nuestra selección de portátiles para todas tus necesidades
        </Typography>
      </Box>
      
      {/* Mostrar error si existe */}
      {error && (
        <Box sx={{ mb: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Mostrar spinner mientras carga */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                position: 'relative',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }
              }}>
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

                {/* Discount badge if product has discount */}
                {product.discountPrice && product.discountPrice < product.price && (
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
                      -{Math.round((1 - (product.discountPrice / product.price)) * 100)}%
                    </Typography>
                  </Box>
                )}

                <CardMedia
                  component="img"
                  height="180"
                  image={product.image || 'https://via.placeholder.com/300x200?text=Laptop'}
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
                    {product.discountPrice && product.discountPrice < product.price ? (
                      <>
                        <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {product.price.toFixed(2)}€
                        </Typography>
                        <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                          {product.discountPrice.toFixed(2)}€
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        {product.price.toFixed(2)}€
                      </Typography>
                    )}
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
      )}

      {/* Dialog for product specifications */}
      <Dialog 
        open={openSpecsDialog} 
        onClose={() => setOpenSpecsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {selectedProduct.name}
              <IconButton 
                edge="end" 
                color="inherit" 
                onClick={() => setOpenSpecsDialog(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CardMedia
                    component="img"
                    image={selectedProduct.image || 'https://via.placeholder.com/300x200?text=Laptop'}
                    alt={selectedProduct.name}
                    sx={{ borderRadius: 1, mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TableContainer component={Paper} elevation={0} variant="outlined">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Marca
                          </TableCell>
                          <TableCell>
                            {selectedProduct.brand || 'No especificado'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Procesador
                          </TableCell>
                          <TableCell>
                            {selectedProduct.processor || 'No especificado'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            RAM
                          </TableCell>
                          <TableCell>
                            {selectedProduct.ram || 'No especificado'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Almacenamiento
                          </TableCell>
                          <TableCell>
                            {selectedProduct.storage || 'No especificado'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Gráfica
                          </TableCell>
                          <TableCell>
                            {selectedProduct.graphics || 'No especificado'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Pantalla
                          </TableCell>
                          <TableCell>
                            {selectedProduct.screen || 'No especificado'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Precio
                          </TableCell>
                          <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                            {selectedProduct.discountPrice && selectedProduct.discountPrice < selectedProduct.price 
                              ? `${selectedProduct.discountPrice.toFixed(2)}€ (${Math.round((1 - (selectedProduct.discountPrice / selectedProduct.price)) * 100)}% descuento)`
                              : `${selectedProduct.price.toFixed(2)}€`
                            }
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
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

      {/* Snackbar for cart messages */}
      <Snackbar
        open={showCartMessage}
        autoHideDuration={3000}
        onClose={() => setShowCartMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowCartMessage(false)} 
          severity={cartMessage.includes('Error') || cartMessage.includes('iniciar sesión') ? 'warning' : 'success'} 
          sx={{ width: '100%' }}
        >
          {cartMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Portatiles;
