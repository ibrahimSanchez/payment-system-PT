const express = require('express');
const router = express.Router();
const { createPayment, updatePaymentById } = require('../controllers/paymentController');

router.post('/', createPayment);
// router.patch('/:id', updatePaymentById);

module.exports = router;