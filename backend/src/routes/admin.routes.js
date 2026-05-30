const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUserRole,
  updateUserSubscription,
  updateUserStatus,
  getLoginLogs,
  getStats,
} = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', getUsers);

router.put('/users/:id/role', updateUserRole);


router.put('/users/:id/subscription', updateUserSubscription);


router.put('/users/:id/status', updateUserStatus);

router.get('/login-logs', getLoginLogs);


router.get('/stats', getStats);

module.exports = router;
