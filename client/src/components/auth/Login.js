import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Alert, Grid, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/api';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useAuth } from '../../context/AuthContext';
import { syncCart } from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const { email, password } = formData;

  const onChange = e => {
    console.log('onChange:', e.target.name, e.target.value);
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, rellena todos los campos');
      return;
    }

    try {
      const response = await login(formData);
      
      // Usar el contexto de autenticación para iniciar sesión
      authLogin(response.token, email);
      
      // Sincronizar el carrito local con el servidor
      try {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (localCart.length > 0) {
          await syncCart(localCart);
        }
      } catch (syncError) {
        console.error('Error al sincronizar el carrito:', syncError);
      }
      
      // Redirigir a la página principal
      navigate('/');
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.response?.data?.msg || err.msg || 'Error al iniciar sesión');
    }
  };

  return (
    <Container maxWidth="none" style={{ height: '100vh', padding: 0, position: 'relative' }}>
      <Box 
        component={Link}
        to="/"
        sx={{
          position: 'absolute',
          top: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'block',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateX(-50%) scale(1.05)',
            transition: 'transform 0.2s ease-in-out'
          }
        }}
      >
        <img 
          src="/logo.png" 
          alt="Logo" 
          style={{ 
            width: '300px'
          }} 
        />
      </Box>
      <Grid container style={{ height: '100%' }}>
        {/* Panel izquierdo */}
        <Grid item xs={6} style={{ 
          backgroundColor: '#ffffff', 
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Línea divisoria vertical */}
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: '150px',
              height: 'calc(100% - 200px)',
              width: '1px',
              backgroundColor: '#e0e0e0'
            }}
          />
          <Box style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%'
          }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LocalShippingIcon style={{ fontSize: 40, color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Gestiona tus pedidos"
                  secondary="Ten el control de todos tus pedidos y recibe notificaciones con el seguimiento"
                  primaryTypographyProps={{ style: { fontSize: '1.5rem', fontWeight: 500, marginBottom: '8px' } }}
                  secondaryTypographyProps={{ style: { fontSize: '1rem' } }}
                />
              </ListItem>
              <ListItem style={{ marginTop: '32px' }}>
                <ListItemIcon>
                  <VerifiedIcon style={{ fontSize: 40, color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Entérate de nuestras mejores ofertas"
                  secondary="Podrás ver siempre nuestros mejores artículos con las mejores ofertas"
                  primaryTypographyProps={{ style: { fontSize: '1.5rem', fontWeight: 500, marginBottom: '8px' } }}
                  secondaryTypographyProps={{ style: { fontSize: '1rem' } }}
                />
              </ListItem>
            </List>
          </Box>
        </Grid>

        {/* Panel derecho */}
        <Grid item xs={6} style={{ 
          backgroundColor: '#ffffff',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px'
        }}>
          <Box style={{ 
            maxWidth: '400px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>


        <Typography variant="h5" style={{ marginBottom: '16px' }}>
          Iniciar Sesión
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            style={{ marginBottom: '16px', width: '100%' }}
          >
            {error}
          </Alert>
        )}

        <form 
          onSubmit={onSubmit} 
          style={{ width: '100%' }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={onChange}
            style={{ marginBottom: '16px' }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onChange}
            style={{ marginBottom: '24px' }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ 
              marginBottom: '16px',
              padding: '12px',
              fontSize: '1rem'
            }}
          >
            Iniciar Sesión
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
            style={{ padding: '12px' }}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
        </form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
