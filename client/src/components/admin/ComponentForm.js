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

const COMPONENT_TYPES = ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Cooling'];

const ComponentForm = () => {
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
    specs: {}
  });

  useEffect(() => {
    if (id) {
      fetchComponent();
    }
  }, [id]);

  const fetchComponent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/components/${id}`, {
        headers: { 'x-auth-token': token }
      });
      
      // Procesar los datos del componente para manejar los precios correctamente
      const componentData = { ...response.data };
      
      // Asegurarse de que price sea un número
      if (typeof componentData.price === 'string') {
        componentData.price = Number(componentData.price);
      }
      
      // Si hay discountPrice, asegurarse de que sea un número
      if (componentData.discountPrice) {
        componentData.discountPrice = Number(componentData.discountPrice);
      }
      
      console.log('Componente cargado:', componentData);
      setFormData(componentData);
    } catch (err) {
      setError('Error al cargar el componente');
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

  const getSpecFields = () => {
    switch (formData.type) {
      case 'CPU':
        return (
          <>
            <TextField
              name="specs.cores"
              label="Núcleos"
              type="number"
              value={formData.specs.cores || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="specs.threads"
              label="Hilos"
              type="number"
              value={formData.specs.threads || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="specs.base_clock"
              label="Frecuencia Base"
              value={formData.specs.base_clock || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="specs.socket"
              label="Socket"
              value={formData.specs.socket || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="specs.tdp"
              label="TDP"
              value={formData.specs.tdp || ''}
              onChange={handleChange}
              fullWidth
              required
            />
          </>
        );
      case 'Motherboard':
        return (
          <>
            <TextField
              name="specs.socket"
              label="Socket"
              value={formData.specs.socket || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="specs.form_factor"
              label="Factor de Forma"
              value={formData.specs.form_factor || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="specs.chipset"
              label="Chipset"
              value={formData.specs.chipset || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="specs.ram_slots"
              label="Slots de RAM"
              type="number"
              value={formData.specs.ram_slots || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="specs.max_ram"
              label="RAM Máxima (GB)"
              type="number"
              value={formData.specs.max_ram || ''}
              onChange={handleChange}
              fullWidth
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Preparar los datos para enviar
    const dataToSend = { ...formData };
    
    // Asegurarse de que los precios se manejen correctamente
    if (dataToSend.price) {
      // Convertir a número si es string
      dataToSend.price = Number(dataToSend.price);
    }
    
    // Manejar el precio con descuento
    if (dataToSend.discountPrice === '' || dataToSend.discountPrice === undefined) {
      // Si no hay precio con descuento, eliminar la propiedad
      delete dataToSend.discountPrice;
    } else {
      // Asegurarse de que discountPrice sea un número
      dataToSend.discountPrice = Number(dataToSend.discountPrice);
      console.log('Precio con descuento establecido a:', dataToSend.discountPrice);
    }

    // Debug: mostrar datos que se van a enviar
    console.log('Datos a enviar:', dataToSend);
    console.log('Especificaciones:', dataToSend.specs);

    try {
      const token = localStorage.getItem('token');
      if (id) {
        await axios.put(
          `http://localhost:5000/api/components/${id}`,
          dataToSend,
          { headers: { 'x-auth-token': token } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/components',
          dataToSend,
          { headers: { 'x-auth-token': token } }
        );
      }
      navigate('/admin/components');
    } catch (err) {
      setError('Error al guardar el componente');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Editar Componente' : 'Nuevo Componente'}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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
                label="Tipo"
                select
                value={formData.type}
                onChange={handleChange}
                fullWidth
                required
              >
                {COMPONENT_TYPES.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
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
                Imagen del Componente
              </Typography>
              <ImageUpload
                value={formData.image}
                onChange={(url) => handleChange({ target: { name: 'image', value: url } })}
              />
            </Grid>

            {formData.type && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Especificaciones
                </Typography>
                <Grid container spacing={2}>
                  {getSpecFields()}
                </Grid>
              </Grid>
            )}

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  onClick={() => navigate('/admin/components')}
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

export default ComponentForm;
