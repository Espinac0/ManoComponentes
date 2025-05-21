import React, { createContext, useState, useEffect, useContext } from 'react';
import { syncCart, getUserCart } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      
      if (token) {
        setIsAuthenticated(true);
        setUserEmail(email || '');
        
        // Si el usuario está autenticado, intentar sincronizar el carrito local con el servidor
        // pero no bloquear la autenticación si hay errores
        const guestCartKey = 'cart_guest';
        const userCartKey = `cart_${email}`;
        const guestCart = JSON.parse(localStorage.getItem(guestCartKey)) || [];
        const userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
        
        // No esperamos a que se complete la sincronización para continuar
        // Solo intentamos sincronizar si hay elementos en el carrito de invitado
        if (guestCart.length > 0) {
          try {
            // Intentar transferir los elementos del carrito de invitado al carrito del usuario
            const mergedCart = [...userCart];
            
            // Agregar elementos del carrito de invitado al carrito del usuario
            guestCart.forEach(guestItem => {
              const existingItemIndex = mergedCart.findIndex(item => 
                item.component === guestItem.component || item._id === guestItem._id
              );
              
              if (existingItemIndex >= 0) {
                // Si el elemento ya existe, incrementar la cantidad
                mergedCart[existingItemIndex].quantity += guestItem.quantity;
              } else {
                // Si el elemento no existe, agregarlo
                mergedCart.push(guestItem);
              }
            });
            
            // Guardar el carrito combinado en localStorage
            localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
            
            // Limpiar el carrito de invitado
            localStorage.removeItem(guestCartKey);
            
            // Disparar evento para actualizar la UI
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
            // Sincronizar con el servidor si es necesario
            syncCart(mergedCart).catch(error => {
              console.error('Error al sincronizar el carrito:', error);
            });
          } catch (error) {
            console.error('Error al sincronizar el carrito:', error);
          }
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  const login = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserEmail(email);
    
    // Manejar la transición del carrito al iniciar sesión
    const guestCartKey = 'cart_guest';
    const userCartKey = `cart_${email}`;
    const guestCart = JSON.parse(localStorage.getItem(guestCartKey)) || [];
    const userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    
    // Solo intentamos transferir si hay elementos en el carrito de invitado
    if (guestCart.length > 0) {
      try {
        // Intentar transferir los elementos del carrito de invitado al carrito del usuario
        const mergedCart = [...userCart];
        
        // Agregar elementos del carrito de invitado al carrito del usuario
        guestCart.forEach(guestItem => {
          const existingItemIndex = mergedCart.findIndex(item => 
            item.component === guestItem.component || item._id === guestItem._id
          );
          
          if (existingItemIndex >= 0) {
            // Si el elemento ya existe, incrementar la cantidad
            mergedCart[existingItemIndex].quantity += guestItem.quantity;
          } else {
            // Si el elemento no existe, agregarlo
            mergedCart.push(guestItem);
          }
        });
        
        // Guardar el carrito combinado en localStorage
        localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
        
        // Limpiar el carrito de invitado
        localStorage.removeItem(guestCartKey);
        
        // Disparar evento para actualizar la UI
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (error) {
        console.error('Error al transferir el carrito de invitado:', error);
      }
    }
  };
  
  const logout = () => {
    // Guardar el email antes de eliminarlo para poder acceder al carrito del usuario
    const email = localStorage.getItem('userEmail');
    
    // Eliminar token y email
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    
    // Actualizar el estado
    setIsAuthenticated(false);
    setUserEmail('');
    
    // Disparar evento para actualizar la UI del carrito
    // Esto asegura que el contador del carrito se actualice correctamente
    // cuando el usuario cierra sesión y se muestra el carrito de invitado
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Recargar la página para asegurar que la sesión se cierre correctamente
    // Usar setTimeout para asegurar que los cambios de estado se apliquen antes de recargar
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userEmail, 
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
