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
    // Preparar los datos del componente
    const componentData = { ...req.body };
    
    console.log('Datos recibidos en POST:', componentData);
    
    // Asegurarse de que price sea un número
    if (typeof componentData.price === 'string') {
      componentData.price = Number(componentData.price);
    }
    
    // Para mantener compatibilidad con código existente, establecer originalPrice = price
    componentData.originalPrice = componentData.price;
    
    // Manejar el precio con descuento
    if (componentData.discountPrice !== undefined && componentData.discountPrice !== '') {
      // Asegurarse de que sea un número
      if (typeof componentData.discountPrice === 'string') {
        componentData.discountPrice = Number(componentData.discountPrice);
      }
      console.log('Guardando precio con descuento:', componentData.discountPrice);
    } else {
      // Si no hay descuento, asegurarse de que el campo no exista en la BD
      delete componentData.discountPrice;
      console.log('No hay precio con descuento, eliminando el campo');
    }
    
    console.log('Datos procesados en POST:', componentData);
    
    // Crear el componente con los datos procesados
    const newComponent = new Component(componentData);
    const component = await newComponent.save();
    console.log('Componente guardado en la BD:', component);
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
    
    // Preparar los datos actualizados
    const updateData = { ...req.body };
    
    console.log('Datos recibidos en PUT:', updateData);
    console.log('Componente existente:', existingComponent);
    
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
        updateData.originalPrice = existingComponent.price;
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

    // Preparar los datos para la actualización
    const updateFields = {
      ...updateData,
      specs: updatedSpecs
    };
    
    // Si hay precio con descuento, asegurarnos de que se incluya explícitamente
    if (updateData.discountPrice !== undefined) {
      updateFields.discountPrice = updateData.discountPrice;
      console.log('Incluyendo explícitamente discountPrice:', updateFields.discountPrice);
    } else {
      // Si no hay precio con descuento, establecer explícitamente a null para que se elimine
      updateFields.$unset = { discountPrice: 1 };
      console.log('Eliminando explícitamente el campo discountPrice');
    }
    
    console.log('Campos finales para actualización:', updateFields);
    
    // Actualizamos el componente
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      updateFields,
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
