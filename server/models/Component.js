const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PSU', 'Cooling']
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
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
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(specs) {
        switch(this.type) {
          case 'CPU':
            return specs.cores && specs.threads && specs.base_clock && 
                   specs.socket && specs.tdp;
          case 'GPU':
            return specs.memory && specs.memory_type && specs.core_clock && 
                   specs.boost_clock && specs.tdp;
          case 'Motherboard':
            return specs.socket && specs.form_factor && specs.chipset && 
                   specs.ram_slots && specs.max_ram;
          case 'RAM':
            return specs.capacity && specs.speed && specs.type;
          case 'Storage':
            return specs.capacity && specs.type && specs.interface;
          case 'PSU':
            return specs.wattage && specs.efficiency && specs.modular;
          case 'Cooling':
            return specs.type && specs.tdp_rating;
          default:
            return false;
        }
      },
      message: 'Las especificaciones no son válidas para este tipo de componente'
    }
  }
}, {
  timestamps: true
});

// Índices para mejorar las búsquedas
componentSchema.index({ type: 1 });
componentSchema.index({ brand: 1 });
componentSchema.index({ price: 1 });
componentSchema.index({ name: 'text' }); // Para búsquedas de texto

module.exports = mongoose.model('Component', componentSchema);
