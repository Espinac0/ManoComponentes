import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userEmail } = useAuth();
  
  // Función para disparar eventos de actualización del carrito
  const triggerCartUpdate = () => {
    // Disparar el evento para notificar a los componentes que escuchan
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // También disparar un evento de storage para asegurar que todos los componentes se actualicen
    // Esto es especialmente útil para actualizar componentes en diferentes partes de la aplicación
    try {
      // Un truco simple para forzar la actualización en todos los componentes
      localStorage.setItem('__cart_update_trigger', Date.now().toString());
      localStorage.removeItem('__cart_update_trigger');
    } catch (error) {
      console.error('Error al disparar evento de storage:', error);
    }
  };

  // Obtener la clave del localStorage según el usuario
  const getCartKey = () => {
    return isAuthenticated && userEmail ? `cart_${userEmail}` : 'cart_guest';
  };
  
  // Cargar el carrito al iniciar o cuando cambia el usuario
  useEffect(() => {
    const loadCart = () => {
      try {
        // Obtener la clave del carrito según el usuario
        const cartKey = getCartKey();
        
        // Cargar el carrito desde localStorage
        const localCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        setCartItems(localCart);
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        // En caso de error, inicializar con un carrito vacío
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, userEmail]);

  // Escuchar eventos de actualización del carrito
  useEffect(() => {
    const handleCartUpdate = () => {
      const cartKey = getCartKey();
      const localCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCartItems(localCart);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isAuthenticated, userEmail]);

  // Añadir un producto al carrito
  const addToCart = async (component) => {
    try {
      // Obtener la clave del carrito según el usuario
      const cartKey = getCartKey();
      
      // Actualizar el carrito local
      const currentCart = [...cartItems];
      const existingItemIndex = currentCart.findIndex(item => 
        item.component === component._id || item._id === component._id
      );
      
      if (existingItemIndex >= 0) {
        currentCart[existingItemIndex].quantity += 1;
      } else {
        currentCart.push({
          component: component._id,
          _id: component._id,
          quantity: 1,
          name: component.name,
          price: component.discountPrice || component.price, // Usar precio con descuento si está disponible
          originalPrice: component.price, // Guardar también el precio original para referencia
          image: component.image
        });
      }
      
      setCartItems(currentCart);
      localStorage.setItem(cartKey, JSON.stringify(currentCart));
      
      // Disparar evento de actualización
      triggerCartUpdate();
      return true;
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      return false;
    }
  };

  // Incrementar la cantidad de un producto
  const increaseQuantity = async (itemId) => {
    try {
      // Obtener la clave del carrito según el usuario
      const cartKey = getCartKey();
      
      // Actualizar el carrito local
      const updatedCart = cartItems.map(item => {
        if (item._id === itemId || item.component === itemId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      
      setCartItems(updatedCart);
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      
      // Disparar evento de actualización
      triggerCartUpdate();
      return true;
    } catch (error) {
      console.error('Error al incrementar cantidad:', error);
      return false;
    }
  };

  // Decrementar la cantidad de un producto
  const decreaseQuantity = async (itemId) => {
    try {
      // Obtener la clave del carrito según el usuario
      const cartKey = getCartKey();
      
      // Actualizar el carrito local
      const updatedCart = cartItems.map(item => {
        if ((item._id === itemId || item.component === itemId) && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      
      setCartItems(updatedCart);
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      
      // Disparar evento de actualización
      triggerCartUpdate();
      return true;
    } catch (error) {
      console.error('Error al decrementar cantidad:', error);
      return false;
    }
  };

  // Eliminar un producto del carrito
  const removeItem = async (itemId) => {
    try {
      // Obtener la clave del carrito según el usuario
      const cartKey = getCartKey();
      
      // Actualizar el carrito local
      const updatedCart = cartItems.filter(item => 
        item._id !== itemId && item.component !== itemId
      );
      
      setCartItems(updatedCart);
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      
      // Disparar evento de actualización
      triggerCartUpdate();
      return true;
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      return false;
    }
  };

  // Vaciar el carrito
  const clearCart = async () => {
    try {
      // Obtener la clave del carrito según el usuario
      const cartKey = getCartKey();
      
      // Vaciar el carrito local
      setCartItems([]);
      localStorage.removeItem(cartKey);
      
      // Disparar evento de actualización
      triggerCartUpdate();
      return true;
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
      return false;
    }
  };

  // Actualizar la cantidad de un producto directamente
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      // Validar que la cantidad sea un número positivo
      if (isNaN(newQuantity) || newQuantity < 1) {
        return false;
      }
      
      // Obtener la clave del carrito según el usuario
      const cartKey = getCartKey();
      
      // Actualizar el carrito local
      const updatedCart = cartItems.map(item => {
        if (item._id === itemId || item.component === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      
      setCartItems(updatedCart);
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      
      // Disparar evento de actualización
      triggerCartUpdate();
      return true;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      return false;
    }
  };

  // Calcular el total del carrito
  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      // Usar el precio actualizado (que ya puede ser el precio con descuento)
      return sum + (item.price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart,
      updateQuantity,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
