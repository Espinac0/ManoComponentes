import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Paper
} from '@mui/material';
import axios from 'axios';
import ImageUpload from '../common/ImageUpload';

const COMPUTER_TYPES = ['Laptop', 'Desktop'];

const ComputerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    brand: '',
    originalPrice: '',
    discountPrice: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    specs: {
      processor: '',
      graphics: '',
      ram: '',
      storage: '',
      screen: '',
      os: '',
      connectivity: '',
      extras: ''
    }
  });

  useEffect(() => {
    if (id) {
      fetchComputer();
    }
  }, [id]);

  const fetchComputer = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/computers/${id}`, {
        headers: { 'x-auth-token': token }
      });
      
      // Procesar los datos del ordenador para manejar los precios correctamente
      const computerData = { ...response.data };
      
      // Asegurarse de que price sea un número
      if (typeof computerData.price === 'string') {
        computerData.price = Number(computerData.price);
      }
      
      // Si hay discountPrice, asegurarse de que sea un número
      if (computerData.discountPrice) {
        computerData.discountPrice = Number(computerData.discountPrice);
      }
      
      console.log('Ordenador cargado:', computerData);
      setFormData(computerData);
    } catch (err) {
      setError('Error al cargar el ordenador');
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;

    // Convertir valores numéricos
    if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }

    if (name.startsWith('specs.')) {
      const specName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specName]: finalValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: finalValue
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'x-auth-token': token
      };

      // Validar campos requeridos
      if (!formData.name || !formData.type || !formData.brand || !formData.price || 
          !formData.stock || !formData.description || !formData.image ||
          !formData.specs.processor || !formData.specs.graphics || 
          !formData.specs.ram || !formData.specs.storage) {
        setError('Por favor, completa todos los campos requeridos');
        setLoading(false);
        return;
      }

      // Si es un portátil, la pantalla es obligatoria
      if (formData.type === 'Laptop' && !formData.specs.screen) {
        setError('Para portátiles, el campo de pantalla es obligatorio');
        setLoading(false);
        return;
      }

      if (id) {
        // Actualizar ordenador existente
        await axios.put(`http://localhost:5000/api/computers/${id}`, formData, { headers });
      } else {
        // Crear nuevo ordenador
        await axios.post('http://localhost:5000/api/computers', formData, { headers });
      }

      navigate('/admin/computers');
    } catch (err) {
      setError('Error al guardar el ordenador: ' + (err.response?.data?.msg || err.message));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Editar Ordenador' : 'Nuevo Ordenador'}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Nombre"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="type"
                select
                label="Tipo"
                value={formData.type}
                onChange={handleChange}
                fullWidth
                required
              >
                {COMPUTER_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === 'Laptop' ? 'Portátil' : 'Sobremesa'}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="brand"
                label="Marca"
                value={formData.brand}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Precio Original"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="discountPrice"
                label="Precio con Descuento"
                type="number"
                value={formData.discountPrice || ''}
                onChange={(e) => {
                  console.log('Cambiando precio con descuento:', e.target.value);
                  // Si el campo está vacío, establecer discountPrice como null o vacío
                  if (e.target.value === '') {
                    setFormData(prev => {
                      const newData = { ...prev };
                      newData.discountPrice = '';
                      console.log('Estableciendo discountPrice a cadena vacía');
                      return newData;
                    });
                  } else {
                    const numValue = Number(e.target.value);
                    setFormData(prev => {
                      const newData = { ...prev };
                      newData.discountPrice = numValue;
                      console.log('Estableciendo discountPrice a:', numValue);
                      return newData;
                    });
                  }
                }}
                helperText="Dejar en blanco si no hay descuento"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stock"
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Imagen del Ordenador
              </Typography>
              <ImageUpload
                value={formData.image}
                onChange={(url) => handleChange({ target: { name: 'image', value: url } })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Especificaciones
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="specs.processor"
                    label="Procesador"
                    value={formData.specs.processor || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText="Ej: Intel Core i7-12700K / AMD Ryzen 9 5900X"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="specs.graphics"
                    label="Tarjeta Gráfica"
                    value={formData.specs.graphics || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText="Ej: NVIDIA GeForce RTX 3080 / AMD Radeon RX 6800 XT"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="specs.ram"
                    label="Memoria RAM"
                    value={formData.specs.ram || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText="Ej: 16GB DDR4 3200MHz / 32GB DDR5 5200MHz"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="specs.storage"
                    label="Almacenamiento"
                    value={formData.specs.storage || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText="Ej: SSD 1TB NVMe / HDD 2TB + SSD 512GB"
                  />
                </Grid>
                {(formData.type === 'Laptop' || formData.type === '') && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="specs.screen"
                      label="Pantalla"
                      value={formData.specs.screen || ''}
                      onChange={handleChange}
                      fullWidth
                      required={formData.type === 'Laptop'}
                      helperText="Ej: 15.6 pulgadas FHD IPS 144Hz / 17.3 pulgadas QHD 165Hz"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="specs.os"
                    label="Sistema Operativo"
                    value={formData.specs.os || ''}
                    onChange={handleChange}
                    fullWidth
                    helperText="Ej: Windows 11 Home / Sin SO"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="specs.connectivity"
                    label="Conectividad"
                    value={formData.specs.connectivity || ''}
                    onChange={handleChange}
                    fullWidth
                    helperText="Ej: WiFi 6, Bluetooth 5.2, 3x USB 3.2, HDMI"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="specs.extras"
                    label="Extras"
                    value={formData.specs.extras || ''}
                    onChange={handleChange}
                    fullWidth
                    helperText="Ej: Teclado RGB, Webcam HD, Lector de huellas"
                  />
                </Grid>
              </Grid>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  onClick={() => navigate('/admin/computers')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ComputerForm;
