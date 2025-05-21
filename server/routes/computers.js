const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Computer = require('../models/Computer');

// @route   GET api/computers/search
// @desc    Buscar ordenadores por texto
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ msg: 'Se requiere un término de búsqueda' });
    }
    
    // Buscar ordenadores que coincidan con el término de búsqueda en nombre, descripción o marca
    const computers = await Computer.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } },
        // Buscar también en las especificaciones
        { 'specifications.processor': { $regex: query, $options: 'i' } },
        { 'specifications.graphics': { $regex: query, $options: 'i' } },
        { 'specifications.ram': { $regex: query, $options: 'i' } },
        { 'specifications.storage': { $regex: query, $options: 'i' } },
        { 'specifications.screen': { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json(computers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/computers
// @desc    Get all computers or filter by type
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

    const computers = await Computer.find(query);
    res.json(computers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/computers/:id
// @desc    Get computer by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const computer = await Computer.findById(req.params.id);
    if (!computer) {
      return res.status(404).json({ msg: 'Ordenador no encontrado' });
    }
    res.json(computer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ordenador no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/computers
// @desc    Create a computer
// @access  Private (Admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    // Preparar los datos del ordenador
    const computerData = { ...req.body };
    
    console.log('Datos recibidos en POST:', computerData);
    
    // Asegurarse de que price sea un número
    if (typeof computerData.price === 'string') {
      computerData.price = Number(computerData.price);
    }
    
    // Para mantener compatibilidad con código existente, establecer originalPrice = price
    computerData.originalPrice = computerData.price;
    
    // Manejar el precio con descuento
    if (computerData.discountPrice !== undefined && computerData.discountPrice !== '') {
      // Asegurarse de que sea un número
      if (typeof computerData.discountPrice === 'string') {
        computerData.discountPrice = Number(computerData.discountPrice);
      }
      console.log('Guardando precio con descuento:', computerData.discountPrice);
    } else {
      // Si no hay descuento, asegurarse de que el campo no exista en la BD
      delete computerData.discountPrice;
      console.log('No hay precio con descuento, eliminando el campo');
    }
    
    console.log('Datos procesados en POST:', computerData);
    
    // Crear el ordenador con los datos procesados
    const newComputer = new Computer(computerData);
    const computer = await newComputer.save();
    console.log('Ordenador guardado en la BD:', computer);
    res.json(computer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   PUT api/computers/:id
// @desc    Update a computer
// @access  Private (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    // Primero obtenemos el ordenador existente
    const existingComputer = await Computer.findById(req.params.id);
    if (!existingComputer) {
      return res.status(404).json({ msg: 'Ordenador no encontrado' });
    }
    
    // Preparar los datos actualizados
    const updateData = { ...req.body };
    
    console.log('Datos recibidos en PUT:', updateData);
    console.log('Ordenador existente:', existingComputer);
    
    // Manejar los precios en los datos actualizados
    if (updateData.price !== undefined || updateData.discountPrice !== undefined) {
      // Asegurarse de que price sea un número
      if (typeof updateData.price === 'string') {
        updateData.price = Number(updateData.price);
      }
      
      // Para mantener compatibilidad con código existente, establecer originalPrice = price
      if (updateData.price !== undefined) {
        updateData.originalPrice = updateData.price;
      } else {
        // Si no se actualiza price, mantener originalPrice igual a price
        updateData.originalPrice = existingComputer.price;
      }
      
      // Manejar el precio con descuento
      if (updateData.discountPrice !== undefined && updateData.discountPrice !== '') {
        // Asegurarse de que sea un número
        if (typeof updateData.discountPrice === 'string') {
          updateData.discountPrice = Number(updateData.discountPrice);
        }
        console.log('Actualizando precio con descuento a:', updateData.discountPrice);
      } else {
        // Si se envía un string vacío o undefined, eliminar el campo
        delete updateData.discountPrice;
        console.log('Eliminando precio con descuento');
      }
      // No modificamos price en función de discountPrice, price siempre es el precio original
    }
    
    console.log('Datos procesados en PUT:', updateData);
    
    // Actualizamos el ordenador
    const computer = await Computer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!computer) {
      return res.status(404).json({ msg: 'Ordenador no encontrado' });
    }
    res.json(computer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ordenador no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

// @route   DELETE api/computers/:id
// @desc    Delete a computer
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const computer = await Computer.findById(req.params.id);
    if (!computer) {
      return res.status(404).json({ msg: 'Ordenador no encontrado' });
    }
    await computer.remove();
    res.json({ msg: 'Ordenador eliminado' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ordenador no encontrado' });
    }
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
