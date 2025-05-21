const mongoose = require('mongoose');

const computerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Laptop', 'Desktop'] // Portátil o Sobremesa
  },
  brand: {
    type: String,
    required: true
  },
  // price es el precio original/normal del ordenador
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // discountPrice es el precio con descuento (opcional)
  discountPrice: {
    type: Number,
    min: 0,
    default: null
  },
  // originalPrice mantenido para compatibilidad con código existente
  originalPrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  specs: {
    // Todos los campos son string para poder poner el nombre del componente
    processor: {
      type: String,
      required: true
    },
    graphics: {
      type: String,
      required: true
    },
    ram: {
      type: String,
      required: true
    },
    storage: {
      type: String,
      required: true
    },
    // Campo opcional para pantalla (solo para portátiles)
    screen: {
      type: String
    },
    // Campos adicionales opcionales
    os: {
      type: String
    },
    connectivity: {
      type: String
    },
    extras: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Índices para mejorar las búsquedas
computerSchema.index({ type: 1 });
computerSchema.index({ brand: 1 });
computerSchema.index({ price: 1 });
computerSchema.index({ name: 'text' }); // Para búsquedas de texto

module.exports = mongoose.model('Computer', computerSchema);
