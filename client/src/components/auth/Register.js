import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Alert, Grid, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/api';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Validaciones
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    
    if (password.length < minLength) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!hasNumber) {
      return 'La contraseña debe contener al menos un número';
    }
    if (!hasLetter) {
      return 'La contraseña debe contener al menos una letra';
    }
    return '';
  };
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData;

  const onChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validación en tiempo real
    const newErrors = { ...errors };
    delete newErrors[name];

    if (name === 'email' && value && !validateEmail(value)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    if (name === 'password') {
      const passwordError = validatePassword(value);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (name === 'password2' && value && value !== password) {
      newErrors.password2 = 'Las contraseñas no coinciden';
    }

    if (name === 'name' && value.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    // Validaciones antes de enviar
    const newErrors = {};

    if (!name || name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!email || !validateEmail(email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (password !== password2) {
      newErrors.password2 = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }



    try {
      const response = await register({ name, email, password });
      setSuccess('Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Error completo:', err);
      if (err.response?.data?.msg?.includes('duplicate')) {
        setErrors({ email: 'Este email ya está registrado' });
      } else {
        setErrors({ general: err.msg || err.message || 'Error al registrar usuario' });
      }
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

        {/* Panel derecho - Formulario de registro */}
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
          }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Crear cuenta
            </Typography>
            {Object.keys(errors).length > 0 && (
              <Box sx={{ mb: 3 }}>
                {Object.entries(errors).map(([field, message]) => (
                  <Alert key={field} severity="error" sx={{ mb: 1 }}>
                    {message}
                  </Alert>
                ))}
              </Box>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}
            <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nombre"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={onChange}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                value={password}
                onChange={onChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Confirmar Contraseña"
                type="password"
                id="password2"
                value={password2}
                onChange={onChange}
                error={!!errors.password2}
                helperText={errors.password2}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Crear cuenta
              </Button>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2">
                  ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>Iniciar sesión</Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;
