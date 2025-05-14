const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @route   POST api/init/admin
// @desc    Crear usuario administrador inicial
// @access  Public (solo funciona una vez)
router.post('/admin', async (req, res) => {
    try {
        // Verificar si ya existe algún admin
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ msg: 'Ya existe un usuario administrador' });
        }

        // Crear el usuario admin
        const admin = new User({
            name: 'Administrator',
            email: 'admin@admin.com',
            password: 'admin',
            role: 'admin'
        });

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);

        // Guardar admin
        await admin.save();

        res.json({ msg: 'Usuario administrador creado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
