var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define el esquema para la galería
var GaleriaSchema = new Schema({
    imagen: { type: String, required: true },
    producto: { type: Schema.ObjectId, ref: 'producto', required: true },
    createdAt: { type: Date, default: Date.now } // Nota: 'crearedAt' corregido a 'createdAt'
});

// Exporta el modelo usando el esquema correcto
module.exports = mongoose.model('galeria', GaleriaSchema);
