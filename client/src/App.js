import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import ProductList from './components/pages/ProductList';
import ComponentsPage from './components/pages/ComponentsPage';
import ComputersPage from './components/pages/ComputersPage';
import CartPage from './components/pages/CartPage';
import Ofertas from './components/pages/Ofertas';
import SearchPage from './components/pages/SearchPage';
// Componentes
import Graficas from './components/pages/componentes/Graficas';
import PlacasBase from './components/pages/componentes/PlacasBase';
import Procesadores from './components/pages/componentes/Procesadores';
import DiscosDuros from './components/pages/componentes/DiscosDuros';
import Ram from './components/pages/componentes/Ram';
import Refrigeracion from './components/pages/componentes/Refrigeracion';
import FuentesAlimentacion from './components/pages/componentes/FuentesAlimentacion';
// Ordenadores
import Portatiles from './components/pages/ordenadores/Portatiles';
import Sobremesa from './components/pages/ordenadores/Sobremesa';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import ComponentList from './components/admin/ComponentList';
import ComponentForm from './components/admin/ComponentForm';
import ComputerList from './components/admin/ComputerList';
import ComputerForm from './components/admin/ComputerForm';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
// Importar los proveedores de contexto
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f5f5f5',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary'
    }}>
      {!hideNavbar && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/productos/:category" element={<ProductList />} />
          <Route path="/componentes" element={<ComponentsPage />} />
          <Route path="/ordenadores" element={<ComputersPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/graficas" element={<Graficas />} />
          <Route path="/placas-base" element={<PlacasBase />} />
          <Route path="/procesadores" element={<Procesadores />} />
          <Route path="/discos-duros" element={<DiscosDuros />} />
          <Route path="/ram" element={<Ram />} />
          <Route path="/refrigeracion" element={<Refrigeracion />} />
          <Route path="/fuentes-alimentacion" element={<FuentesAlimentacion />} />
          {/* Rutas de ordenadores */}
          <Route path="/portatiles" element={<Portatiles />} />
          <Route path="/sobremesa" element={<Sobremesa />} />
          <Route path="/busqueda" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/components" element={<ProtectedAdminRoute><ComponentList /></ProtectedAdminRoute>} />
          <Route path="/admin/components/new" element={<ProtectedAdminRoute><ComponentForm /></ProtectedAdminRoute>} />
          <Route path="/admin/components/edit/:id" element={<ProtectedAdminRoute><ComponentForm /></ProtectedAdminRoute>} />
          <Route path="/admin/computers" element={<ProtectedAdminRoute><ComputerList /></ProtectedAdminRoute>} />
          <Route path="/admin/computers/new" element={<ProtectedAdminRoute><ComputerForm /></ProtectedAdminRoute>} />
          <Route path="/admin/computers/edit/:id" element={<ProtectedAdminRoute><ComputerForm /></ProtectedAdminRoute>} />
        </Routes>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
