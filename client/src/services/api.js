import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Función auxiliar para configurar el header de autenticación
const authConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  };
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { msg: 'Error de conexión con el servidor' };
    }
};

export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        if (response.data && response.data.token) {
            return response.data;
        } else {
            throw new Error('Respuesta inválida del servidor');
        }
    } catch (error) {
        console.error('Error en login:', error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else if (error.request) {
            throw { msg: 'No se recibió respuesta del servidor' };
        } else {
            throw { msg: error.message || 'Error al procesar la solicitud' };
        }
    }
};

// Funciones para el carrito

// Obtener el carrito del usuario
export const getUserCart = async () => {
    try {
        const response = await axios.get(`${API_URL}/cart`, authConfig());
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { msg: 'Error al obtener el carrito' };
    }
};

// Añadir un item al carrito
export const addToCart = async (componentId, quantity = 1) => {
    try {
        const response = await axios.post(`${API_URL}/cart`, { componentId, quantity }, authConfig());
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { msg: 'Error al añadir al carrito' };
    }
};

// Actualizar la cantidad de un item en el carrito
export const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await axios.put(`${API_URL}/cart/${itemId}`, { quantity }, authConfig());
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { msg: 'Error al actualizar el carrito' };
    }
};

// Eliminar un item del carrito
export const removeFromCart = async (itemId) => {
    try {
        const response = await axios.delete(`${API_URL}/cart/${itemId}`, authConfig());
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { msg: 'Error al eliminar del carrito' };
    }
};

// Vaciar el carrito
export const clearCart = async () => {
    try {
        const response = await axios.delete(`${API_URL}/cart`, authConfig());
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { msg: 'Error al vaciar el carrito' };
    }
};

// Sincronizar el carrito local con el servidor
export const syncCart = async (items) => {
    try {
        const response = await axios.post(`${API_URL}/cart/sync`, { items }, authConfig());
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { msg: 'Error al sincronizar el carrito' };
    }
};
