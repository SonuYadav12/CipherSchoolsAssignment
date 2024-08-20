const express = require('express');
const { createTest, submitTest, getTests, getTestById, updateTest, deleteTest } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');
const { admin, student, checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/create', protect, admin, createTest); 
router.post('/submit', protect, student, submitTest); 
router.get('/', protect, checkRole(['admin', 'student']), getTests); 
router.get('/:id', protect, checkRole(['admin', 'student']), getTestById); 
router.put('/:id', protect, admin, updateTest); 
router.delete('/:id', protect, admin, deleteTest); 

module.exports = router;
