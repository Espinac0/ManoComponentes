const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Component = require('../models/Component');

// @route   GET api/components
// @desc    Get all components or filter by type
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, brand, minPrice, maxPrice, search } = req.query;
    let query = {};

    // Filtros
    if (type) query.type = type;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const components = await Component.find(query);
    res.json(components);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/components/:id
// @desc    Get component by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ msg: 'Componente no encontrado' });
    }
    res.json(component);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Componente no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/components
// @desc    Create a component
// @access  Private (Admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const newComponent = new Component(req.body);
    const component = await newComponent.save();
    res.json(component);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT api/components/:id
// @desc    Update a component
// @access  Private (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    // Primero obtenemos el componente existente
    const existingComponent = await Component.findById(req.params.id);
    if (!existingComponent) {
      return res.status(404).json({ msg: 'Componente no encontrado' });
    }

    // Mezclamos los specs existentes con los nuevos
    const updatedSpecs = {
      ...existingComponent.specs,
      ...req.body.specs
    };

    // Actualizamos el componente
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        specs: updatedSpecs
      },
      { new: true, runValidators: false }
    );
    if (!component) {
      return res.status(404).json({ msg: 'Componente no encontrado' });
    }
    res.json(component);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Componente no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   DELETE api/components/:id
// @desc    Delete a component
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ msg: 'Componente no encontrado' });
    }
    await component.remove();
    res.json({ msg: 'Componente eliminado' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Componente no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
