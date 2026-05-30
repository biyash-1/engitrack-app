
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};


const checkSubscription = (...allowedPlans) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Admins bypass subscription checks
    if (req.user.role === 'admin') {
      return next();
    }

    const { subscription, subscription_expires_at } = req.user;

    // Check if subscription has expired (for free_trial)
    if (subscription === 'free_trial' && subscription_expires_at) {
      const expiryDate = new Date(subscription_expires_at);
      if (expiryDate < new Date()) {
        return res.status(403).json({
          message: 'Your free trial has expired. Please upgrade your subscription.',
          code: 'SUBSCRIPTION_EXPIRED',
        });
      }
    }

    if (allowedPlans.length > 0 && !allowedPlans.includes(subscription)) {
      return res.status(403).json({
        message: `This feature requires ${allowedPlans.join(' or ')} subscription.`,
        code: 'SUBSCRIPTION_REQUIRED',
      });
    }

    next();
  };
};

module.exports = { authorize, checkSubscription, roleHierarchy };
