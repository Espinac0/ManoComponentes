import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import ComponentList from './components/admin/ComponentList';
import ComponentForm from './components/admin/ComponentForm';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/components" element={<ProtectedAdminRoute><ComponentList /></ProtectedAdminRoute>} />
          <Route path="/admin/components/new" element={<ProtectedAdminRoute><ComponentForm /></ProtectedAdminRoute>} />
          <Route path="/admin/components/edit/:id" element={<ProtectedAdminRoute><ComponentForm /></ProtectedAdminRoute>} />
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
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
