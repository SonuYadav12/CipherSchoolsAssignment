const express = require('express');
const { createTest, submitTest, getTests, getTestById } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');
const { admin, student } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/create', protect, admin, createTest);
router.post('/submit', protect, student, submitTest);
router.get('/', protect, student, getTests);
router.get('/:id', protect, student, getTestById);

module.exports = router;
