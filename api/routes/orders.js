const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
	Order.find()
	.select('product quantity _id')
	.populate('product')
	.exec()
	.then(docs => {
		res.status(200).json({
			count: docs.length,
			orders: docs.map(doc => {
				return {
					_id: doc._id,
					product: doc.product,
					quantity: doc.quantity,
					request: {
						type: 'GET',
						url: `http://localhost:3000/orders/ ${doc._id}`
					}
				}
			})
		});
	})
	.catch((e) => {
		res.status(500).json({
			error: e
		})
	});
});

router.post('/', (req, res, next) => {
	Product.findById(req.body.productId)
	.then(product => {
		if (!product) {
			return res.status(404).json({
				message: 'Product was not found'
			});
		}
		const order = new Order({
			_id: mongoose.Types.ObjectId(),
			quantity: req.body.quantity,
			product: req.body.productId
		});
		return order.save()
	})
	.then(result => {
		console.log('the posted order is:', result);
		res.status(201).json({
			message: 'Order was stored',
			createdOrder: {
				_id: result._id,
				product: result.product,
				quantity: result.quantity
			},
			request: {
				type: 'POST',
				url: `http://localhost:3000/orders/ ${result._id}`
			}
		});
	})
	.catch((e) => {
		console.log(e);
		res.status(500).json({
			error: e
		});
	});
});

router.get('/:orderId', (req, res, next) => {
	Order.findById(req.params.orderId)
	.populate('product')
	.exec()
	.then(order => {
		if (!order) {
			return res.status(404).json({
				message: 'Order was not found'
			});
		}
		res.status(200).json({
			order: order,
			request: {
				type: 'GET',
				url: `http://localhost:3000/orders/`
			}
		});
	})
	.catch(e => {
		res.status(500).json({
			error: e
		});
	});
});

router.delete('/:orderId', (req, res, next) => {
	Order.remove({_id: req.params.orderId})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Order was deleted', 
			request: {
				type: 'DELETE',
				url: `http://localhost:3000/orders/`,
				body: {productId: 'ID', quantity: 'Number'}
			}
		});
	})
	.catch(e => {
		res.status(500).json({
			error: e
		});
	});
});

module.exports = router;