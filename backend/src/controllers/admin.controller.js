const User = require('../models/User');
const Project = require('../models/Project');
const LoginLog = require('../models/LoginLog');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['admin', 'engineer', 'viewer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be admin, engineer, or viewer.' });
    }

    // Prevent admin from changing their own role
    if (userId === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated.', user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateUserSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.params.id;

    if (!['free_trial', 'professional', 'enterprise'].includes(subscription)) {
      return res.status(400).json({ message: 'Invalid subscription plan.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let expiresAt = null;
    if (subscription === 'free_trial') {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 14);
      expiresAt = expiry;
    }

    user.subscription = subscription;
    user.subscription_expires_at = expiresAt;
    await user.save();

    res.json({ message: 'Subscription updated.', user });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { is_active } = req.body;
    const userId = req.params.id;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ message: 'is_active must be a boolean.' });
    }

    // Prevent admin from deactivating themselves
    if (userId === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot deactivate your own account.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.is_active = is_active;
    await user.save();

    res.json({ message: `User ${is_active ? 'activated' : 'deactivated'}.`, user });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getLoginLogs = async (req, res) => {
  try {
    const logs = await LoginLog.find()
      .populate('user_id', 'name email')
      .sort({ logged_in_at: -1 })
      .limit(100);

    const formattedLogs = logs.map((log) => ({
      id: log._id,
      user_id: log.user_id ? log.user_id._id : null,
      user_name: log.user_id ? log.user_id.name : 'Unknown',
      user_email: log.user_id ? log.user_id.email : 'Unknown',
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      action: log.action,
      logged_in_at: log.logged_in_at,
    }));

    res.json({ logs: formattedLogs });
  } catch (error) {
    console.error('Get login logs error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ is_active: true });
    const totalProjects = await Project.countDocuments();

    // Roles aggregation
    const rolesAggregate = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    const usersByRole = ['admin', 'engineer', 'viewer'].map((role) => {
      const found = rolesAggregate.find((item) => item._id === role);
      return { role, count: found ? found.count : 0 };
    });

    // Subscriptions aggregation
    const subAggregate = await User.aggregate([
      { $group: { _id: '$subscription', count: { $sum: 1 } } }
    ]);
    const usersBySubscription = ['free_trial', 'professional', 'enterprise'].map((subscription) => {
      const found = subAggregate.find((item) => item._id === subscription);
      return { subscription, count: found ? found.count : 0 };
    });

    // Recent logins
    const recentLoginsRaw = await LoginLog.find()
      .populate('user_id', 'name email')
      .sort({ logged_in_at: -1 })
      .limit(10);

    const recentLogins = recentLoginsRaw.map((log) => ({
      id: log._id,
      user_id: log.user_id ? log.user_id._id : null,
      user_name: log.user_id ? log.user_id.name : 'Unknown',
      user_email: log.user_id ? log.user_id.email : 'Unknown',
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      action: log.action,
      logged_in_at: log.logged_in_at,
    }));

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalProjects,
        usersByRole,
        usersBySubscription,
      },
      recentLogins,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  updateUserSubscription,
  updateUserStatus,
  getLoginLogs,
  getStats,
};
