const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Component = require('../models/Component');

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            // Si no existe un carrito, crear uno vacío
            cart = new Cart({
                user: req.user.id,
                items: []
            });
            await cart.save();
        }
        
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { componentId, quantity } = req.body;
        
        // Verificar que el componente existe
        const component = await Component.findById(componentId);
        if (!component) {
            return res.status(404).json({ msg: 'Componente no encontrado' });
        }
        
        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            // Si no existe un carrito, crear uno nuevo
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }
        
        // Verificar si el item ya existe en el carrito
        const itemIndex = cart.items.findIndex(item => 
            item.component.toString() === componentId
        );
        
        if (itemIndex > -1) {
            // Si el item ya existe, actualizar la cantidad
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Si no existe, añadirlo al carrito
            cart.items.push({
                component: componentId,
                quantity,
                name: component.name,
                price: component.price,
                image: component.image
            });
        }
        
        cart.updatedAt = Date.now();
        await cart.save();
        
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   PUT api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/:itemId', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        
        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }
        
        // Encontrar el item en el carrito
        const itemIndex = cart.items.findIndex(item => 
            item._id.toString() === req.params.itemId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Item no encontrado en el carrito' });
        }
        
        // Actualizar la cantidad
        cart.items[itemIndex].quantity = quantity;
        cart.updatedAt = Date.now();
        
        await cart.save();
        
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   DELETE api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }
        
        // Filtrar el item a eliminar
        cart.items = cart.items.filter(item => 
            item._id.toString() !== req.params.itemId
        );
        
        cart.updatedAt = Date.now();
        await cart.save();
        
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   DELETE api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }
        
        cart.items = [];
        cart.updatedAt = Date.now();
        await cart.save();
        
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   POST api/cart/sync
// @desc    Sync local cart with server cart
// @access  Private
router.post('/sync', auth, async (req, res) => {
    try {
        const { items } = req.body;
        
        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            // Si no existe un carrito, crear uno nuevo
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }
        
        // Reemplazar los items del carrito con los del localStorage
        if (items && items.length > 0) {
            cart.items = items.map(item => ({
                component: item._id,
                quantity: item.quantity,
                name: item.name,
                price: item.price,
                image: item.image
            }));
        }
        
        cart.updatedAt = Date.now();
        await cart.save();
        
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
