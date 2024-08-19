const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Role must be either student or admin.' });
    }

    const user = new User({ email, password, role });
    await user.save();

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.json({ token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ error: 'Role mismatch' });
    }

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.json({ token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

