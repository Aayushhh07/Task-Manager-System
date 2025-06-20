const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
};

const selfOrAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' || req.user._id.toString() === req.params.id)
  ) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied' });
};

module.exports = { adminOnly, selfOrAdmin };
