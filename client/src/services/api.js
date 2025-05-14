import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
