import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Tab,
  Tabs,
  IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';

const ImageUpload = ({ value, onChange }) => {
  const [method, setMethod] = useState('url');
  const [previewUrl, setPreviewUrl] = useState(value || '');

  const handleMethodChange = (event, newValue) => {
    setMethod(newValue);
    // Limpiar el valor cuando se cambia de método
    onChange('');
    setPreviewUrl('');
  };

  const handleUrlChange = (event) => {
    const url = event.target.value;
    onChange(url);
    setPreviewUrl(url);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Crear URL temporal para la vista previa
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Aquí podrías subir el archivo a un servidor y obtener la URL
      // Por ahora, solo usaremos la URL temporal
      onChange(url);
    }
  };

  const handleClear = () => {
    onChange('');
    setPreviewUrl('');
    // Limpiar el input de archivo si existe
    const fileInput = document.getElementById('image-file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Box>
      <Tabs
        value={method}
        onChange={handleMethodChange}
        centered
        sx={{ mb: 2 }}
      >
        <Tab label="URL" value="url" />
        <Tab label="Subir Archivo" value="file" />
      </Tabs>

      {method === 'url' ? (
        <TextField
          fullWidth
          label="URL de la imagen"
          value={value}
          onChange={handleUrlChange}
          sx={{ mb: 2 }}
        />
      ) : (
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2, width: '100%', height: '56px' }}
        >
          Seleccionar Imagen
          <input
            id="image-file-input"
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>
      )}

      {previewUrl && (
        <Paper 
          sx={{ 
            position: 'relative',
            width: '100%',
            p: 1,
            mb: 2
          }}
        >
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)'
              }
            }}
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
          <Box
            component="img"
            src={previewUrl}
            alt="Vista previa"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '200px',
              objectFit: 'contain'
            }}
            onError={() => {
              setPreviewUrl('');
              onChange('');
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default ImageUpload;
