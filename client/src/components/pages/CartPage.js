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
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Cargar los items del carrito desde localStorage
  useEffect(() => {
    const loadCartItems = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cart);
      
      // Calcular el total
      const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotal(cartTotal);
    };
    
    loadCartItems();
  }, []);

  // Actualizar el total cuando cambian los items del carrito
  useEffect(() => {
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(cartTotal);
  }, [cartItems]);

  // Función para incrementar la cantidad de un item
  const increaseQuantity = (itemId) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    updateLocalStorage(updatedCart);
  };

  // Función para decrementar la cantidad de un item
  const decreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    updateLocalStorage(updatedCart);
  };

  // Función para eliminar un item del carrito
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCart);
    updateLocalStorage(updatedCart);
  };

  // Función para actualizar el localStorage y disparar el evento de actualización
  const updateLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  // Función para procesar el pago (simulada)
  const handleCheckout = () => {
    alert('¡Gracias por tu compra! En un sistema real, aquí se procesaría el pago.');
    // Limpiar el carrito después de la compra
    setCartItems([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Carrito de Compra
      </Typography>

      {cartItems.length === 0 ? (
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
                      value={item.quantity}
                      InputProps={{
                        readOnly: true,
                        sx: { width: '60px', textAlign: 'center', input: { textAlign: 'center' } }
                      }}
                    />
                    <IconButton onClick={() => increaseQuantity(item._id)}>
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
                <Typography>{total.toFixed(2)}€</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Envío</Typography>
                <Typography>Gratis</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="error">{total.toFixed(2)}€</Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth 
                size="large"
                startIcon={<ShoppingCartCheckoutIcon />}
                onClick={handleCheckout}
              >
                Finalizar Compra
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;
