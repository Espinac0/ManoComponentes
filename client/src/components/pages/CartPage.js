import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton, 
  Button,
  Divider,
  TextField,
  Paper,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CartPage = () => {
  const { cartItems, loading, increaseQuantity, decreaseQuantity, removeItem, clearCart, getTotal, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [productStocks, setProductStocks] = useState({});
  
  // Obtener el stock de los productos en el carrito
  useEffect(() => {
    const fetchProductStocks = async () => {
      try {
        // Crear un objeto para almacenar el stock de cada producto
        const stocks = {};
        
        // Obtener el stock de cada producto en el carrito
        for (const item of cartItems) {
          const productId = item._id || item.component;
          
          // Verificar si ya tenemos el stock de este producto
          if (!stocks[productId]) {
            try {
              // Obtener el stock del producto desde la API
              const response = await fetch(`http://localhost:5000/api/components/${productId}`);
              const data = await response.json();
              
              // Guardar el stock del producto
              stocks[productId] = data.stock || 10; // Valor predeterminado si no hay stock
            } catch (error) {
              console.error(`Error al obtener el stock del producto ${productId}:`, error);
              stocks[productId] = 10; // Valor predeterminado en caso de error
            }
          }
        }
        
        setProductStocks(stocks);
      } catch (error) {
        console.error('Error al obtener el stock de los productos:', error);
      }
    };
    
    if (cartItems.length > 0) {
      fetchProductStocks();
    }
  }, [cartItems]);
  
  // Función para manejar el cambio de cantidad directamente desde el input
  const handleQuantityChange = (itemId, newValue) => {
    // Convertir el valor a número entero
    const newQuantity = parseInt(newValue, 10);
    
    // Validar que sea un número válido
    if (isNaN(newQuantity) || newQuantity < 1) {
      return;
    }
    
    // Obtener el stock disponible para este producto
    const availableStock = productStocks[itemId] || 10;
    
    // Limitar la cantidad al stock disponible
    const limitedQuantity = Math.min(newQuantity, availableStock);
    
    // Actualizar la cantidad en el carrito
    updateQuantity(itemId, limitedQuantity);
  };

  // Función para procesar el pago (simulada)
  const handleCheckout = async () => {
    setProcessingCheckout(true);
    
    // Simular un proceso de pago
    setTimeout(async () => {
      alert('¡Gracias por tu compra! En un sistema real, aquí se procesaría el pago.');
      
      // Limpiar el carrito después de la compra
      await clearCart();
      
      setProcessingCheckout(false);
    }, 1500);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Carrito de Compra
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tu carrito está vacío
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            href="/componentes"
          >
            Ver Componentes
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Lista de productos */}
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item._id} sx={{ mb: 2, display: 'flex', position: 'relative' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120, height: 120, objectFit: 'contain', p: 2 }}
                  image={item.image || 'https://via.placeholder.com/120x120?text=No+Image'}
                  alt={item.name}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                      {item.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                      {item.price.toFixed(2)}€ / unidad
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 2 }}>
                    <IconButton onClick={() => decreaseQuantity(item._id)}>
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      size="small"
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                      inputProps={{
                        style: { textAlign: 'center', fontSize: '16px' }
                      }}
                      sx={{ 
                        width: '80px',
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          display: 'none',
                        },
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                        },
                      }}
                      helperText={`Stock: ${productStocks[item._id] || '?'}`}
                    />
                    <IconButton 
                      onClick={() => increaseQuantity(item._id)}
                      disabled={item.quantity >= (productStocks[item._id] || 10)}
                    >
                      <AddIcon />
                    </IconButton>
                    <Typography variant="subtitle1" color="error" sx={{ ml: 2, fontWeight: 'bold' }}>
                      {(item.price * item.quantity).toFixed(2)}€
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  sx={{ position: 'absolute', top: 10, right: 10 }}
                  onClick={() => removeItem(item._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            ))}
          </Grid>
          
          {/* Resumen del pedido */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resumen del Pedido
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>{getTotal().toFixed(2)}€</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Envío</Typography>
                <Typography>Gratis</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="error">{getTotal().toFixed(2)}€</Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth 
                size="large"
                startIcon={processingCheckout ? <CircularProgress size={24} color="inherit" /> : <ShoppingCartCheckoutIcon />}
                onClick={handleCheckout}
                disabled={processingCheckout}
              >
                {processingCheckout ? 'Procesando...' : 'Finalizar Compra'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;
