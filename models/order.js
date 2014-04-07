var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    stripe:     String,
    name:       { type: String, trim: true },
    sandwich:   String, 
    created:    { type: Date, default: Date.now },
    ready:      { type: Boolean, default: false },
    note:       String
});

module.exports = mongoose.model('Order', orderSchema);