import React from 'react';
import { Box, Typography, Button, Grid, Paper, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

const AdminDashboard = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SettingsIcon sx={{ fontSize: 40 }} />
        <Typography variant="h4">
          Panel de Administración
        </Typography>
      </Box>


      <Typography variant="h5" sx={{ mb: 3 }}>
        Componentes
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              backgroundColor: '#f5f5f5'
            }}
          >
            <DeveloperBoardIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6">Crear Componente</Typography>
            <Button
              variant="contained"
              component={Link}
              to="/admin/components/new"
              fullWidth
            >
              Crear Nuevo
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              backgroundColor: '#f5f5f5'
            }}
          >
            <DeveloperBoardIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6">Gestionar Componentes</Typography>
            <Button
              variant="contained"
              component={Link}
              to="/admin/components"
              fullWidth
            >
              Ver Listado
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mb: 3 }}>
        Administración
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              backgroundColor: '#e3f2fd'
            }}
          >
            <BarChartIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6">Estadísticas</Typography>
            <Button
              variant="contained"
              component={Link}
              to="/admin/stats"
              fullWidth
            >
              Ver Estadísticas
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              backgroundColor: '#e3f2fd'
            }}
          >
            <PeopleIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6">Usuarios</Typography>
            <Button
              variant="contained"
              component={Link}
              to="/admin/users"
              fullWidth
            >
              Gestionar Usuarios
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
