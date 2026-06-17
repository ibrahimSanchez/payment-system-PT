const express = require('express');
const router = express.Router({ mergeParams: true });
const { createCard, getUserCards, getUserCardById, updateUserCardById } = require('../controllers/cardController');

router.post('/', createCard);
router.get('/', getUserCards);
router.get('/:tarjeta_id', getUserCardById);
router.patch('/:tarjeta_id', updateUserCardById);

module.exports = router;