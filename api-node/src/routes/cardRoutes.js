const express = require('express');
const router = express.Router({ mergeParams: true });
const { createCard, getUserCards } = require('../controllers/cardController');

router.post('/', createCard);
router.get('/', getUserCards);

module.exports = router;