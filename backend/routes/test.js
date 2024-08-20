const express = require('express');
const { createTest, submitTest, getTests, getTestById, updateTest, deleteTest } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');
const { admin, student } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/create', protect, admin, createTest);
router.post('/submit', protect, student, submitTest);
router.get('/', protect, admin, getTests);
router.get('/:id', protect, admin, getTestById);
router.put('/:id', protect, admin, updateTest);
router.delete('/:id', protect, admin, deleteTest);

module.exports = router;
