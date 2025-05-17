import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

// Definir categorías predefinidas (igual que en ComponentsPage.js)
const categories = {
  'gpu': 'Tarjetas Gráficas',
  'cpu': 'Procesadores',
  'motherboard': 'Placas Base',
  'ram': 'Memoria RAM',
  'storage': 'Discos Duros',
  'cooling': 'Refrigeración',
  'psu': 'Fuentes de Alimentación',
  'all': 'Todos los componentes'
};

const ComponentList = () => {
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComponents();
  }, []);
  
  // Efecto para filtrar los componentes cuando cambia el tipo seleccionado o los componentes
  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredComponents(components);
    } else {
      const filtered = components.filter(component => {
        // Verificar el nombre y la categoría para determinar el tipo
        const name = (component.name || '').toLowerCase();
        const category = (component.category || '').toLowerCase();
        const type = (component.type || '').toLowerCase();
        
        switch(selectedType) {
          case 'gpu':
            return name.includes('gráfica') || name.includes('gpu') || 
                  name.includes('geforce') || name.includes('radeon') || 
                  category.includes('gráfica') || category.includes('gpu') ||
                  type.includes('gpu') || type.includes('gráfica');
          case 'cpu':
            return name.includes('procesador') || name.includes('cpu') || 
                  name.includes('ryzen') || name.includes('intel') || 
                  category.includes('procesador') || category.includes('cpu') ||
                  type.includes('cpu') || type.includes('procesador');
          case 'motherboard':
            return name.includes('placa') || name.includes('motherboard') || 
                  category.includes('placa') || category.includes('motherboard') ||
                  type.includes('placa') || type.includes('motherboard');
          case 'ram':
            return name.includes('ram') || name.includes('memoria') || 
                  category.includes('ram') || category.includes('memoria') ||
                  type.includes('ram') || type.includes('memoria');
          case 'storage':
            return name.includes('disco') || name.includes('ssd') || 
                  name.includes('hdd') || name.includes('storage') || 
                  category.includes('disco') || category.includes('almacenamiento') ||
                  type.includes('disco') || type.includes('almacenamiento') || 
                  type.includes('ssd') || type.includes('hdd');
          case 'cooling':
            return name.includes('refrigera') || name.includes('cooling') || 
                  name.includes('ventilador') || name.includes('disipador') || 
                  category.includes('refrigera') || category.includes('cooling') ||
                  type.includes('refrigera') || type.includes('cooling') || 
                  type.includes('ventilador') || type.includes('disipador');
          case 'psu':
            return name.includes('fuente') || name.includes('alimentación') || 
                  name.includes('psu') || name.includes('power supply') || 
                  category.includes('fuente') || category.includes('alimentación') ||
                  type.includes('fuente') || type.includes('alimentación') || 
                  type.includes('psu');
          default:
            return true;
        }
      });
      setFilteredComponents(filtered);
    }
  }, [selectedType, components]);
  
  // Manejador para cambiar el tipo seleccionado
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const fetchComponents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/components', {
        headers: { 'x-auth-token': token }
      });
      setComponents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los componentes');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este componente?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/components/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchComponents();
      } catch (err) {
        setError('Error al eliminar el componente');
        console.error('Error:', err);
      }
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestión de Componentes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          href="/admin/components/new"
        >
          Nuevo Componente
        </Button>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="component-type-label">Filtrar por tipo</InputLabel>
            <Select
              labelId="component-type-label"
              id="component-type-select"
              value={selectedType}
              label="Filtrar por tipo"
              onChange={handleTypeChange}
            >
              {Object.entries(categories).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComponents.map((component) => (
              <TableRow key={component._id}>
                <TableCell>{component.name}</TableCell>
                <TableCell>{component.type}</TableCell>
                <TableCell>{component.brand}</TableCell>
                <TableCell>{component.price}€</TableCell>
                <TableCell>{component.stock}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    href={`/admin/components/edit/${component._id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDelete(component._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ComponentList;
