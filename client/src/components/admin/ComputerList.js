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

// Definir categorías predefinidas
const categories = {
  'laptop': 'Portátiles',
  'desktop': 'Sobremesa',
  'all': 'Todos los ordenadores'
};

const ComputerList = () => {
  const [computers, setComputers] = useState([]);
  const [filteredComputers, setFilteredComputers] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComputers();
  }, []);
  
  // Efecto para filtrar los ordenadores cuando cambia el tipo seleccionado o los ordenadores
  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredComputers(computers);
    } else {
      const filtered = computers.filter(computer => {
        return computer.type.toLowerCase() === selectedType;
      });
      setFilteredComputers(filtered);
    }
  }, [selectedType, computers]);
  
  // Manejador para cambiar el tipo seleccionado
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const fetchComputers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/computers', {
        headers: { 'x-auth-token': token }
      });
      setComputers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los ordenadores');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ordenador?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/computers/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchComputers();
      } catch (err) {
        setError('Error al eliminar el ordenador');
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
          Gestión de Ordenadores
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          href="/admin/computers/new"
        >
          Nuevo Ordenador
        </Button>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="computer-type-label">Filtrar por tipo</InputLabel>
            <Select
              labelId="computer-type-label"
              id="computer-type-select"
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
            {filteredComputers.map((computer) => (
              <TableRow key={computer._id}>
                <TableCell>{computer.name}</TableCell>
                <TableCell>{computer.type === 'Laptop' ? 'Portátil' : 'Sobremesa'}</TableCell>
                <TableCell>{computer.brand}</TableCell>
                <TableCell>{computer.price}€</TableCell>
                <TableCell>{computer.stock}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    href={`/admin/computers/edit/${computer._id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDelete(computer._id)}
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

export default ComputerList;
