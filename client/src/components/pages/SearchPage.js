import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import LaptopIcon from '@mui/icons-material/Laptop';
import DevicesIcon from '@mui/icons-material/Devices';
import MemoryIcon from '@mui/icons-material/Memory';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Obtener la consulta de búsqueda de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);
  
  // Función para realizar la búsqueda
  const performSearch = async (query) => {
    setLoading(true);
    console.log('Buscando:', query);
    
    try {
      // Buscar en componentes
      let componentsData = [];
      try {
        const componentsResponse = await fetch(`http://localhost:5000/api/components?search=${encodeURIComponent(query)}`);
        componentsData = await componentsResponse.json();
        console.log('Resultados de componentes:', componentsData);
      } catch (error) {
        console.error('Error al buscar componentes:', error);
      }
      
      // Buscar en ordenadores
      let computersData = [];
      try {
        const computersResponse = await fetch(`http://localhost:5000/api/computers?search=${encodeURIComponent(query)}`);
        computersData = await computersResponse.json();
        console.log('Resultados de ordenadores:', computersData);
      } catch (error) {
        console.error('Error al buscar ordenadores:', error);
      }
      
      // Combinar resultados y marcar su tipo
      const components = componentsData.map(item => ({ ...item, type: 'component' }));
      const computers = computersData.map(item => ({ ...item, type: 'computer' }));
      
      // Unir todos los resultados
      const allResults = [...components, ...computers];
      console.log('Todos los resultados:', allResults);
      
      setSearchResults(allResults);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar la búsqueda desde el formulario
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/busqueda?query=${encodeURIComponent(searchQuery.trim())}`);
      performSearch(searchQuery.trim());
    }
  };
  
  // Efecto para ocultar el mensaje del carrito después de 3 segundos
  useEffect(() => {
    if (showCartMessage) {
      const timer = setTimeout(() => {
        setShowCartMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCartMessage]);

  // Función para añadir al carrito
  const handleAddToCart = async (product) => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      // Mostrar mensaje indicando que se requiere iniciar sesión
      setCartMessage('Inicia sesión para añadir productos al carrito');
      setShowCartMessage(true);
      return;
    }
    
    // Usar el contexto para añadir al carrito
    const success = await addToCart(product);
    
    if (success) {
      // Mostrar mensaje de confirmación
      setCartMessage(`${product.name} añadido al carrito`);
      setShowCartMessage(true);
    } else {
      // Mostrar mensaje de error
      setCartMessage('Error al añadir al carrito');
      setShowCartMessage(true);
    }
  };
  
  // Función para abrir el diálogo de detalles del producto
  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };
  
  // Función para cerrar el diálogo de detalles
  const handleCloseDetails = () => {
    setDialogOpen(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabecera de la página */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
        Resultados de búsqueda
      </Typography>
      
      {/* Formulario de búsqueda */}
      <Box 
        component="form" 
        onSubmit={handleSearch}
        sx={{ 
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          width: { xs: '100%', sm: '70%', md: '50%' }
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="secondary"
          sx={{ ml: 1, borderRadius: '20px' }}
        >
          Buscar
        </Button>
      </Box>
      
      {/* Mensaje de carrito */}
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
      
      {/* Resultados de la búsqueda */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : searchResults.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No se encontraron resultados para "{searchQuery}"
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/componentes')}
              startIcon={<MemoryIcon />}
            >
              Ver componentes
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => navigate('/ordenadores')}
              startIcon={<LaptopIcon />}
            >
              Ver ordenadores
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Se encontraron {searchResults.length} resultados para "{searchQuery}"
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {searchResults.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={product.name}
                      sx={{ objectFit: 'contain', p: 2 }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                      }}
                    >
                      {product.discountPrice && (
                        <Chip 
                          label={`-${Math.round((1 - product.discountPrice / product.price) * 100)}%`} 
                          size="small" 
                          color="error"
                          sx={{ fontWeight: 'bold' }}
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, pt: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold', minHeight: '2.5em', wordWrap: 'break-word' }}>
                      {product.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '3em', maxHeight: '4.5em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.description?.substring(0, 100)}{product.description?.length > 100 ? '...' : ''}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      {product.discountPrice ? (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            {product.price.toFixed(2)}€
                          </Typography>
                          <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                            {product.discountPrice.toFixed(2)}€
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {product.price.toFixed(2)}€
                        </Typography>
                      )}
                      
                      {product.stock <= 0 && (
                        <Chip 
                          label="Agotado" 
                          size="small" 
                          color="error"
                        />
                      )}
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleOpenDetails(product)}
                      startIcon={<InfoIcon />}
                      sx={{ color: 'black' }}
                    >
                      Detalles
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      Añadir
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {/* Diálogo de detalles del producto */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedProduct.name}</Typography>
              <IconButton onClick={handleCloseDetails}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={selectedProduct.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={selectedProduct.name}
                      sx={{ 
                        width: '100%', 
                        objectFit: 'contain',
                        borderRadius: 1,
                        mb: 2
                      }}
                    />
                    {selectedProduct.discountPrice && (
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
                        {Math.round((1 - selectedProduct.discountPrice / selectedProduct.price) * 100)}% OFF
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {selectedProduct.discountPrice ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                          {selectedProduct.discountPrice.toFixed(2)}€
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {selectedProduct.price.toFixed(2)}€
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="h5">
                        {selectedProduct.price.toFixed(2)}€
                      </Typography>
                    )}
                  </Box>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      handleCloseDetails();
                    }}
                    disabled={selectedProduct.stock <= 0}
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
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Marca
                          </TableCell>
                          <TableCell>{selectedProduct.brand}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Tipo
                          </TableCell>
                          <TableCell>
                            {selectedProduct.type === 'component' ? 'Componente' : 
                              (selectedProduct.type === 'laptop' ? 'Portátil' : 'Sobremesa')}
                          </TableCell>
                        </TableRow>
                        {/* Mostrar especificaciones para ordenadores */}
                        {selectedProduct.type !== 'component' && selectedProduct.specifications && (
                          <>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                Procesador
                              </TableCell>
                              <TableCell>{selectedProduct.specifications.processor}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                Tarjeta Gráfica
                              </TableCell>
                              <TableCell>{selectedProduct.specifications.graphics}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                Memoria RAM
                              </TableCell>
                              <TableCell>{selectedProduct.specifications.ram}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                Almacenamiento
                              </TableCell>
                              <TableCell>{selectedProduct.specifications.storage}</TableCell>
                            </TableRow>
                            {selectedProduct.specifications.screen && (
                              <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                  Pantalla
                                </TableCell>
                                <TableCell>{selectedProduct.specifications.screen}</TableCell>
                              </TableRow>
                            )}
                          </>
                        )}
                        {/* Mostrar descripción para componentes */}
                        {selectedProduct.type === 'component' && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Descripción
                            </TableCell>
                            <TableCell>{selectedProduct.description}</TableCell>
                          </TableRow>
                        )}
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Stock
                          </TableCell>
                          <TableCell>
                            {selectedProduct.stock > 0 ? `${selectedProduct.stock} unidades disponibles` : 'Agotado'}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default SearchPage;
