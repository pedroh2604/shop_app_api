const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
mongoose.connect('mongodb://pedroh2604:'+ process.env.MONGO_ATLAS_PW +'@noderestapi-shard-00-00-hbzpo.mongodb.net:27017,noderestapi-shard-00-01-hbzpo.mongodb.net:27017,noderestapi-shard-00-02-hbzpo.mongodb.net:27017/test?ssl=true&replicaSet=nodeRestApi-shard-0&authSource=admin&retryWrites=true',
{ 
	useNewUrlParser: true 
});

// app.use((req, res, next) => {
// 	res.status(200).json({
// 		message: 'it works'
// 	});
// });

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// if it reaches this line, no route was found
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;