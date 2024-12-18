var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VariedadSchema = Schema({
    proveedor: { type: String, required: true },
    variedad: { type: String, required: true },
    sku: { type: String, required: true },
    stock: { type: Number, default: 0, required: true },
    producto: { type: Schema.ObjectId, ref: 'producto', required: true },
    crearedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('variedad', VariedadSchema);