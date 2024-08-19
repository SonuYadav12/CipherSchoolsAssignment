const express = require('express');
const authRoutes = require('./auth');
const testRoutes = require('./test');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tests', testRoutes);

module.exports = router;
