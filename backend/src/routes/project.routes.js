const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');
const { authenticate } = require('../middleware/auth');
const { authorize, checkSubscription } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { createProjectSchema, updateProjectSchema } = require('../schemas/project.schema');

router.use(authenticate);

router.get('/', getProjects);

router.get('/:id', getProject);

router.post(
  '/',
  authorize('admin', 'engineer'),
  checkSubscription(),
  validate(createProjectSchema),
  createProject
);

router.put(
  '/:id',
  authorize('admin', 'engineer'),
  checkSubscription(),
  validate(updateProjectSchema),
  updateProject
);

router.delete('/:id', authorize('admin', 'engineer'), deleteProject);

module.exports = router;
