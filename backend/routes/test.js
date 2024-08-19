const express = require('express');
const { createTest, submitTest, getTests } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createTest);
router.post('/submit', protect, submitTest);
router.get('/', protect, getTests);

module.exports = router;