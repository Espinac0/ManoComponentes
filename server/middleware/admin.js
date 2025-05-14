const User = require('../models/User');

module.exports = async function(req, res, next) {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Acceso denegado - No eres administrador' });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor');
    }
};
