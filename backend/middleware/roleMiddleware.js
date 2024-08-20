const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  console.error('Access denied. Admins only.');
  res.status(403).json({ error: 'Access denied. Admins only.' });
};

const student = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  console.error('Access denied. Students only.');
  res.status(403).json({ error: 'Access denied. Students only.' });
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    console.error(`Access denied. Required roles: ${roles.join(', ')}`);
    res.status(403).json({ error: `Access denied. Required roles: ${roles.join(', ')}` });
  };
};

module.exports = { admin, student, checkRole };
