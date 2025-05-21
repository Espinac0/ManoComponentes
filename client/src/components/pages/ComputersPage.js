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
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow,
  Divider
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginIcon from '@mui/icons-material/Login';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import LaptopIcon from '@mui/icons-material/Laptop';
import DevicesIcon from '@mui/icons-material/Devices';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Define computer types
const computerTypes = {
  'laptop': 'Portátiles',
  'desktop': 'Sobremesa'
};

const ComputersPage = () => {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [openSpecsDialog, setOpenSpecsDialog] = useState(false);
  // States for carousel by type
  const [carouselIndexes, setCarouselIndexes] = useState({
    laptop: 0,
    desktop: 0
  });
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Number of computers to show per page in the carousel
  const maxItemsPerPage = 4;

  useEffect(() => {
    fetchComputers();
  }, []);
  
  const fetchComputers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/computers');
      setComputers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching computers:', err);
      setError('Error al cargar los ordenadores. Por favor, inténtelo de nuevo más tarde.');
      setLoading(false);
    }
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

  // Function to add a product to cart using context
  const handleAddToCart = async (computer) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show message indicating login is required
      setCartMessage('Inicia sesión para añadir productos al carrito');
      setShowCartMessage(true);
      return;
    }
    
    // Use context to add to cart
    const success = await addToCart(computer);
    
    if (success) {
      // Show confirmation message
      setCartMessage(`${computer.name} añadido al carrito`);
      setShowCartMessage(true);
    } else {
      // Show error message
      setCartMessage('Error al añadir al carrito');
      setShowCartMessage(true);
    }
  };

  // Function to get computers by type
  const getComputersByType = (type) => {
    return computers.filter(computer => 
      computer.type.toLowerCase() === type.toLowerCase()
    );
  };

  // Function to advance to next group of computers for a specific type
  const handleNext = (type) => {
    const computersOfType = getComputersByType(type);
    const maxIndex = Math.ceil(computersOfType.length / maxItemsPerPage) - 1;
    
    setCarouselIndexes(prev => ({
      ...prev,
      [type.toLowerCase()]: Math.min(prev[type.toLowerCase()] + 1, maxIndex)
    }));
  };

  // Function to go back to previous group of computers for a specific type
  const handlePrevious = (type) => {
    setCarouselIndexes(prev => ({
      ...prev,
      [type.toLowerCase()]: Math.max(prev[type.toLowerCase()] - 1, 0)
    }));
  };

  // Function to render a carousel for a specific type of computer
  const renderCarousel = (type) => {
    const computersOfType = getComputersByType(type);
    const currentIndex = carouselIndexes[type.toLowerCase()] || 0;
    const startIdx = currentIndex * maxItemsPerPage;
    const endIdx = startIdx + maxItemsPerPage;
    const currentComputers = computersOfType.slice(startIdx, endIdx);
    const totalPages = Math.ceil(computersOfType.length / maxItemsPerPage);

    return (
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {type === 'Laptop' ? (
              <LaptopIcon sx={{ mr: 1, color: 'primary.main' }} />
            ) : (
              <DevicesIcon sx={{ mr: 1, color: 'primary.main' }} />
            )}
            <Typography variant="h5" component="h2">
              {computerTypes[type.toLowerCase()]}
            </Typography>
          </Box>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => handlePrevious(type)}
                disabled={currentIndex === 0}
                color="primary"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="body2" sx={{ mx: 1 }}>
                {currentIndex + 1} / {totalPages}
              </Typography>
              <IconButton 
                onClick={() => handleNext(type)}
                disabled={currentIndex >= totalPages - 1}
                color="primary"
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          {currentComputers.length > 0 ? (
            currentComputers.map((computer) => (
              <Grid item xs={12} sm={6} md={3} key={computer._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={computer.image}
                    alt={computer.name}
                    sx={{ objectFit: 'contain', pt: 2 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ minHeight: '2.5em', wordWrap: 'break-word' }}>
                      {computer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {computer.brand}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Procesador:</strong> {computer.specs.processor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Gráfica:</strong> {computer.specs.graphics}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>RAM:</strong> {computer.specs.ram}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Almacenamiento:</strong> {computer.specs.storage}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    {computer.discountPrice ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                          {computer.discountPrice.toFixed(2)}€
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {computer.price.toFixed(2)}€
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {computer.price.toFixed(2)}€
                      </Typography>
                    )}
                  </Box>
                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => {
                        setSelectedComputer(computer);
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
                      onClick={() => handleAddToCart(computer)}
                      startIcon={<AddShoppingCartIcon />}
                    >
                      Añadir
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                No hay {computerTypes[type.toLowerCase()]} disponibles en este momento.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Ordenadores
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Descubre nuestra selección de ordenadores de alta calidad
        </Typography>
        <Divider />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>
          {error}
        </Typography>
      ) : (
        <>
          {/* Render carousel for laptops */}
          {renderCarousel('Laptop')}
          
          {/* Render carousel for desktops */}
          {renderCarousel('Desktop')}
        </>
      )}

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

      {/* Computer details dialog */}
      <Dialog
        open={openSpecsDialog}
        onClose={() => setOpenSpecsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedComputer && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedComputer.name}</Typography>
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
                      image={selectedComputer.image}
                      alt={selectedComputer.name}
                      sx={{ 
                        width: '100%', 
                        objectFit: 'contain',
                        borderRadius: 1,
                        mb: 2
                      }}
                    />
                    {selectedComputer.discountPrice && (
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
                        {Math.round((1 - selectedComputer.discountPrice / selectedComputer.price) * 100)}% OFF
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {selectedComputer.discountPrice ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                          {selectedComputer.discountPrice.toFixed(2)}€
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {selectedComputer.price.toFixed(2)}€
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="h5">
                        {selectedComputer.price.toFixed(2)}€
                      </Typography>
                    )}
                  </Box>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart(selectedComputer)}
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
                          <TableCell>{selectedComputer.brand}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Tipo
                          </TableCell>
                          <TableCell>
                            {selectedComputer.type === 'Laptop' ? 'Portátil' : 'Sobremesa'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Procesador
                          </TableCell>
                          <TableCell>{selectedComputer.specs.processor}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Tarjeta Gráfica
                          </TableCell>
                          <TableCell>{selectedComputer.specs.graphics}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Memoria RAM
                          </TableCell>
                          <TableCell>{selectedComputer.specs.ram}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                            Almacenamiento
                          </TableCell>
                          <TableCell>{selectedComputer.specs.storage}</TableCell>
                        </TableRow>
                        {selectedComputer.type === 'Laptop' && selectedComputer.specs.screen && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Pantalla
                            </TableCell>
                            <TableCell>{selectedComputer.specs.screen}</TableCell>
                          </TableRow>
                        )}
                        {selectedComputer.specs.os && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Sistema Operativo
                            </TableCell>
                            <TableCell>{selectedComputer.specs.os}</TableCell>
                          </TableRow>
                        )}
                        {selectedComputer.specs.connectivity && (
                          <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                              Conectividad
                            </TableCell>
                            <TableCell>{selectedComputer.specs.connectivity}</TableCell>
                          </TableRow>
                        )}
                        {selectedComputer.specs.extras && (
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
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ComputersPage;
