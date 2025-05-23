import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, IconButton, CircularProgress, Snackbar, Alert, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
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
  const [discountedComputers, setDiscountedComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComputers, setLoadingComputers] = useState(true);
  const [error, setError] = useState(null);
  const [computerError, setComputerError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openSpecsDialog, setOpenSpecsDialog] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [openComputerSpecsDialog, setOpenComputerSpecsDialog] = useState(false);
  
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
  const handleAddToCart = (product) => {
    addToCart(product);
    
    if (isAuthenticated) {
      setCartMessage(`${product.name} añadido al carrito correctamente`);
    } else {
      setCartMessage('Inicia sesión para guardar tu carrito permanentemente');
    }
    
    setShowCartMessage(true);
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

      {/* Componentes con ofertas */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          ¡Nuestras mejores ofertas en componentes!
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
          <Grid container spacing={3}>
            {discountedProducts.slice(0, 4).map((product) => (
              <Grid item key={product._id || product.id} xs={12} sm={6} md={3}>
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
                  {/* Info button */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      zIndex: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)'
                      }
                    }}
                    onClick={() => {
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
                    sx={{ 
                      objectFit: 'contain',
                      padding: '10px'
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      maxHeight: '3em'
                    }}>
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
      </Box>

      {/* Discounted Computers Section */}
      {discountedComputers.length > 0 && (
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'black' }}>
            Ordenadores en Oferta
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            ¡Consigue un ordenador completo a precio de ganga!
          </Typography>

          {loadingComputers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : computerError ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">{computerError}</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {discountedComputers.slice(0, 4).map((computer) => (
                <Grid item xs={12} sm={6} md={3} key={computer._id || computer.id}>
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
                          -{computer.discountPercentage}%
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Info button */}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        zIndex: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)'
                        }
                      }}
                      onClick={() => {
                        setSelectedComputer(computer);
                        setOpenComputerSpecsDialog(true);
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                    
                    <CardMedia
                      component="img"
                      height="200"
                      image={computer.image}
                      alt={computer.name}
                      sx={{ 
                        objectFit: 'contain', 
                        padding: '10px'
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {computer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        maxHeight: '3em'
                      }}>
                        {computer.description}
                      </Typography>
                      
                      {/* Price display */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {computer.originalPrice.toFixed(2)}€
                        </Typography>
                        <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                          {computer.discountPrice.toFixed(2)}€
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    {/* Add to cart button */}
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Tooltip title={isAuthenticated ? "Añadir al carrito" : "Inicia sesión para añadir al carrito"} arrow>
                        <Button 
                          variant="contained" 
                          fullWidth 
                          color="secondary"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => handleAddToCart(computer)}
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
          
          {/* View all button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              component={Link} 
              to="/ofertas"
            >
              Ver todas las ofertas
            </Button>
          </Box>
        </Box>
      )}

      {/* Product Specs Dialog */}
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
                        'Socket': 'Socket',
                        'Pci_slots': 'Ranuras PCI',
                        'Expansion_slots': 'Ranuras de expansión',
                        'Sata_ports': 'Puertos SATA',
                        'M2_slots': 'Ranuras M.2',
                        'Usb_ports': 'Puertos USB',
                        'Max_memory': 'Memoria máxima',
                        'Memory_type': 'Tipo de memoria',
                        'Memory_speed': 'Velocidad de memoria',
                        'Cores': 'Núcleos',
                        'Threads': 'Hilos',
                        'Base_clock': 'Frecuencia base',
                        'Boost_clock': 'Frecuencia turbo',
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
                    image={selectedComputer.image}
                    alt={selectedComputer.name}
                    sx={{ 
                      height: 'auto', 
                      width: '100%', 
                      objectFit: 'contain',
                      borderRadius: 1,
                      mb: 2
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', mb: 2 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      {selectedComputer.originalPrice.toFixed(2)}€
                    </Typography>
                    <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                      {selectedComputer.discountPrice.toFixed(2)}€
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: 'error.main',
                        color: 'white',
                        borderRadius: '12px',
                        px: 1.5,
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <DiscountIcon fontSize="small" />
                      <Typography variant="body2" fontWeight="bold">
                        {selectedComputer.discountPercentage}% OFF
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="h6" gutterBottom>Especificaciones:</Typography>
                  <TableContainer>
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
                            Memoria RAM
                          </TableCell>
                          <TableCell>{selectedComputer.specs?.ram}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Tarjeta Gráfica
                          </TableCell>
                          <TableCell>{selectedComputer.specs?.graphics}</TableCell>
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

export default Home;
