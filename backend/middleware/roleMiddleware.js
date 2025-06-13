const roleMiddleware = (roles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role; // set by authMiddleware
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Access Denied: Insufficient role' });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Authorization check failed' });
    }
  };
};

export default roleMiddleware;

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

