import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/api';

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
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          Registro
        </Typography>
        {Object.keys(errors).length > 0 && (
          <Box sx={{ mt: 2 }}>
            {Object.entries(errors).map(([field, message]) => (
              <Alert key={field} severity="error" sx={{ mb: 1 }}>
                {message}
              </Alert>
            ))}
          </Box>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
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
            Registrarse
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
