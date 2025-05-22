import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, CircularProgress, Snackbar, Alert, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableRow, IconButton, Tabs, Tab, Paper, Divider, CardActions } from '@mui/material';
import DiscountIcon from '@mui/icons-material/LocalOffer';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import ComputerIcon from '@mui/icons-material/Computer';
import MemoryIcon from '@mui/icons-material/Memory';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Ofertas = () => {
  // State for storing discounted products and computers
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [discountedComputers, setDiscountedComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComputers, setLoadingComputers] = useState(true);
  const [error, setError] = useState(null);
  const [computerError, setComputerError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [openSpecsDialog, setOpenSpecsDialog] = useState(false);
  const [openComputerSpecsDialog, setOpenComputerSpecsDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 for all, 1 for components, 2 for computers
  
  // Get functions from cart and authentication contexts
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

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

    const fetchDiscountedComputers = async () => {
      try {
        setLoadingComputers(true);
        // Get all computers
        const response = await axios.get('http://localhost:5000/api/computers');
        
        // Filter only those with discount price
        const computersWithDiscount = response.data.filter(computer => 
          computer.discountPrice && computer.discountPrice < computer.price
        );
        
        // Calculate discount percentage for each computer
        const computersWithPercentage = computersWithDiscount.map(computer => {
          const discountPercentage = Math.round((1 - (computer.discountPrice / computer.price)) * 100);
          return {
            ...computer,
            originalPrice: computer.price,
            discountPercentage
          };
        });
        
        setDiscountedComputers(computersWithPercentage);
        setLoadingComputers(false);
      } catch (err) {
        console.error('Error fetching discounted computers:', err);
        setComputerError('Error al cargar los ordenadores con descuento');
        setLoadingComputers(false);
      }
    };

    fetchDiscountedProducts();
    fetchDiscountedComputers();
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };  
  
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Todas las Ofertas
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Aprovecha nuestros mejores descuentos en componentes y ordenadores
        </Typography>
      </Box>
      
      {/* Tabs for filtering */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            indicatorColor="primary"
            textColor="primary"
            aria-label="ofertas tabs"
          >
            <Tab icon={<DiscountIcon />} label="Todas las Ofertas" />
            <Tab icon={<MemoryIcon />} label="Componentes" />
            <Tab icon={<ComputerIcon />} label="Ordenadores" />
          </Tabs>
        </Paper>
      </Box>

      {/* Show error if it exists */}
      {error && (
        <Box sx={{ mb: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Show spinner while loading */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {discountedProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
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

                {/* Discount label */}
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
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
      )}

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
      
      {/* Computers Section */}
      {(tabValue === 0 || tabValue === 2) && (
        <Box sx={{ mb: 6 }}>
          {tabValue === 2 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Ordenadores en Oferta
              </Typography>
              <Typography variant="h6" align="center" color="text.secondary" paragraph>
                Consigue un ordenador completo a precio de ganga
              </Typography>
            </Box>
          )}
          
          {tabValue === 0 && (
            <Box sx={{ mt: 8, mb: 4 }}>
              <Divider sx={{ mb: 4 }} />
              <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Ordenadores en Oferta
              </Typography>
              <Typography variant="h6" align="center" color="text.secondary" paragraph>
                Consigue un ordenador completo a precio de ganga
              </Typography>
            </Box>
          )}
          
          {/* Show error if it exists */}
          {computerError && (
            <Box sx={{ mb: 4 }}>
              <Alert severity="error">{computerError}</Alert>
            </Box>
          )}

          {/* Show loading spinner if loading */}
          {loadingComputers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            /* Grid of discounted computers */
            <Grid container spacing={4}>
              {discountedComputers.map((computer) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={computer._id}>
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
                    {/* Discount badge */}
                    {computer.discountPrice && computer.price > computer.discountPrice && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          backgroundColor: 'error.main',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          zIndex: 1,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                      >
                        {Math.round((1 - (computer.discountPrice / computer.price)) * 100)}% OFF
                      </Box>
                    )}
                    
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
                        setSelectedComputer(computer);
                        setOpenComputerSpecsDialog(true);
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                    
                    <CardMedia
                      component="img"
                      height="200"
                      image={computer.image || 'https://via.placeholder.com/300x200?text=PC'}
                      alt={computer.name}
                      sx={{ objectFit: 'contain', p: 2 }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'medium', height: '3em', overflow: 'hidden' }}>
                        {computer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {computer.type === 'laptop' ? 'Portátil' : 'Sobremesa'}
                      </Typography>
                      
                      {computer.discountPrice ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                            {computer.discountPrice.toFixed(2)}€
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textDecoration: 'line-through', 
                              color: 'text.secondary',
                              ml: 1
                            }}
                          >
                            {computer.price.toFixed(2)}€
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                          {computer.price.toFixed(2)}€
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Tooltip title={isAuthenticated ? "Añadir al carrito" : "Inicia sesión para añadir al carrito"} arrow>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => handleAddToCart(computer)}
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
          )}
        </Box>
      )}

      {/* Computer Specs Dialog */}
      <Dialog
        open={openComputerSpecsDialog}
        onClose={() => setOpenComputerSpecsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedComputer && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {selectedComputer.name}
              </Typography>
              <IconButton onClick={() => setOpenComputerSpecsDialog(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <CardMedia
                    component="img"
                    image={selectedComputer.image || 'https://via.placeholder.com/500x400?text=PC'}
                    alt={selectedComputer.name}
                    sx={{ width: '100%', height: 'auto', maxHeight: 400, objectFit: 'contain' }}
                  />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                      <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through', mr: 1 }}>
                        {selectedComputer.originalPrice.toFixed(2)}€
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold', mr: 1 }}>
                        {selectedComputer.discountPrice.toFixed(2)}€
                      </Typography>
                      <Box sx={{ 
                        bgcolor: 'error.main', 
                        color: 'white', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <DiscountIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {selectedComputer.discountPercentage}% DESCUENTO
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => {
                        handleAddToCart(selectedComputer);
                        setOpenComputerSpecsDialog(false);
                      }}
                      sx={{ minWidth: 200 }}
                    >
                      Añadir al carrito
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Especificaciones
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Tipo
                          </TableCell>
                          <TableCell>{selectedComputer.type === 'laptop' ? 'Portátil' : 'Sobremesa'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Procesador
                          </TableCell>
                          <TableCell>{selectedComputer.specs?.processor}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Tarjeta Gráfica
                          </TableCell>
                          <TableCell>{selectedComputer.specs?.graphics}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Memoria RAM
                          </TableCell>
                          <TableCell>{selectedComputer.specs?.ram}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Almacenamiento
                          </TableCell>
                          <TableCell>{selectedComputer.specs?.storage}</TableCell>
                        </TableRow>
                        {selectedComputer.type === 'laptop' && selectedComputer.specs?.screen && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Pantalla
                            </TableCell>
                            <TableCell>{selectedComputer.specs.screen}</TableCell>
                          </TableRow>
                        )}
                        {selectedComputer.specs?.os && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Sistema Operativo
                            </TableCell>
                            <TableCell>{selectedComputer.specs.os}</TableCell>
                          </TableRow>
                        )}
                        {selectedComputer.specs?.connectivity && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Conectividad
                            </TableCell>
                            <TableCell>{selectedComputer.specs.connectivity}</TableCell>
                          </TableRow>
                        )}
                        {selectedComputer.specs?.extras && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Extras
                            </TableCell>
                            <TableCell>{selectedComputer.specs.extras}</TableCell>
                          </TableRow>
                        )}
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Stock
                          </TableCell>
                          <TableCell>{selectedComputer.stock} unidades</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {selectedComputer.description && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Descripción:
                      </Typography>
                      <Typography variant="body2">
                        {selectedComputer.description}
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
                  handleAddToCart(selectedComputer);
                  setOpenComputerSpecsDialog(false);
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

export default Ofertas;
