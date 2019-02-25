const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = mongoose.Schema({
	_id: ObjectId,
	name: {type: String, required: true},
	price: {type: Number, required: true},
	productImage: {type: String, required: true}
});


module.exports = mongoose.model('Product', productSchema);