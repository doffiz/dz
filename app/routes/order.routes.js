const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authJwt } = require('../middleware');


router.post('/create', orderController.createOrder);


module.exports = router;
