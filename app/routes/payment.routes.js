const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/create', paymentController.initiatePayment);
router.post('/create-order', paymentController.createOrder);
router.post('/capture', paymentController.capturePayment);

module.exports = router;