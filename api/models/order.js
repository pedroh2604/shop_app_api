const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = mongoose.Schema({
	_id: ObjectId,
	product: {type: ObjectId, ref: 'Product', required: true},
	quantity: {type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);