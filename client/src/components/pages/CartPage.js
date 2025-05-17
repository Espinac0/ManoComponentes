import React, { useState } from 'react';
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
  const { cartItems, loading, increaseQuantity, decreaseQuantity, removeItem, clearCart, getTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [processingCheckout, setProcessingCheckout] = useState(false);

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
