import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Procesador AMD Ryzen 7',
      image: 'https://via.placeholder.com/300x200',
      description: 'Procesador de alta gama para gaming y trabajo profesional'
    },
    {
      id: 2,
      name: 'NVIDIA RTX 3080',
      image: 'https://via.placeholder.com/300x200',
      description: 'Tarjeta gráfica de última generación'
    },
    {
      id: 3,
      name: 'SSD Samsung 1TB',
      image: 'https://via.placeholder.com/300x200',
      description: 'Almacenamiento rápido y confiable'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Bienvenido a MañoComponentes
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Tu tienda de confianza para componentes de ordenador
        </Typography>
      </Box>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Productos Destacados
      </Typography>

      <Grid container spacing={4}>
        {featuredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography>
                  {product.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
