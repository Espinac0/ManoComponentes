const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
    // Obtener el token del header
    const token = req.header('x-auth-token');

    // Verificar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Obtener el usuario
        const user = await User.findById(decoded.user.id);
        
        // Verificar si el usuario existe
        if (!user) {
            return res.status(401).json({ msg: 'Token no válido' });
        }

        // Verificar si el usuario es admin
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Acceso denegado - Se requieren permisos de administrador' });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};
