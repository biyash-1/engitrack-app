const Project = require('../models/Project');

// Subscription limits
const SUBSCRIPTION_LIMITS = {
  free_trial: { maxProjects: 3, allowedTypes: ['residential'] },
  professional: { maxProjects: 20, allowedTypes: ['residential', 'commercial', 'infrastructure', 'other'] },
  enterprise: { maxProjects: Infinity, allowedTypes: ['residential', 'commercial', 'infrastructure', 'other'] },
};

const getProjects = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'engineer') {
      // Engineers see only their own projects
      query = { creator_id: req.user.id };
    } else {
      // Admins and viewers see all projects
      query = {};
    }

    const projects = await Project.find(query)
      .populate('creator_id', 'name email')
      .sort({ created_at: -1 });

    // Transform response to match SQL interface fields (creator_name, creator_email)
    const formattedProjects = projects.map((p) => {
      const projObj = p.toJSON();
      return {
        ...projObj,
        creator_name: p.creator_id ? p.creator_id.name : 'Unknown',
        creator_email: p.creator_id ? p.creator_id.email : 'Unknown',
        creator_id: p.creator_id ? p.creator_id._id || p.creator_id.id : p.creator_id,
      };
    });

    res.json({ projects: formattedProjects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('creator_id', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Viewers can view any, engineers only their own (unless admin)
    if (req.user.role === 'engineer' && project.creator_id.id !== req.user.id) {
      return res.status(403).json({ message: 'You can only view your own projects.' });
    }

    const formattedProject = {
      ...project.toJSON(),
      creator_name: project.creator_id ? project.creator_id.name : 'Unknown',
      creator_email: project.creator_id ? project.creator_id.email : 'Unknown',
      creator_id: project.creator_id ? project.creator_id.id : null,
    };

    res.json({ project: formattedProject });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, type, description } = req.body;
    const userId = req.user.id;
    const subscription = req.user.subscription;

    const limits = SUBSCRIPTION_LIMITS[subscription];

    // Check project count limit (skip for admin)
    if (req.user.role !== 'admin') {
      const projectCount = await Project.countDocuments({ creator_id: userId });
      if (projectCount >= limits.maxProjects) {
        return res.status(403).json({
          message: `You have reached the maximum of ${limits.maxProjects} projects for your ${subscription} plan. Please upgrade.`,
          code: 'PROJECT_LIMIT_REACHED',
        });
      }

      // Check allowed project types
      if (!limits.allowedTypes.includes(type)) {
        return res.status(403).json({
          message: `Project type '${type}' is not available on your ${subscription} plan. Allowed types: ${limits.allowedTypes.join(', ')}`,
          code: 'PROJECT_TYPE_RESTRICTED',
        });
      }
    }

    const project = new Project({
      name,
      type,
      description: description || '',
      creator_id: userId,
    });

    await project.save();

    const populatedProject = await Project.findById(project._id).populate('creator_id', 'name email');
    const formattedProject = {
      ...populatedProject.toJSON(),
      creator_name: populatedProject.creator_id ? populatedProject.creator_id.name : 'Unknown',
      creator_email: populatedProject.creator_id ? populatedProject.creator_id.email : 'Unknown',
      creator_id: populatedProject.creator_id ? populatedProject.creator_id.id : null,
    };

    res.status(201).json({ message: 'Project created successfully.', project: formattedProject });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Only owner or admin can update
    if (req.user.role !== 'admin' && project.creator_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own projects.' });
    }

    const { name, type, description } = req.body;

    // Check type restriction for non-admin
    if (type && req.user.role !== 'admin') {
      const limits = SUBSCRIPTION_LIMITS[req.user.subscription];
      if (!limits.allowedTypes.includes(type)) {
        return res.status(403).json({
          message: `Project type '${type}' is not available on your ${req.user.subscription} plan.`,
          code: 'PROJECT_TYPE_RESTRICTED',
        });
      }
    }

    if (name) project.name = name;
    if (type) project.type = type;
    if (description !== undefined) project.description = description;

    await project.save();

    const populatedProject = await Project.findById(project._id).populate('creator_id', 'name email');
    const formattedProject = {
      ...populatedProject.toJSON(),
      creator_name: populatedProject.creator_id ? populatedProject.creator_id.name : 'Unknown',
      creator_email: populatedProject.creator_id ? populatedProject.creator_id.email : 'Unknown',
      creator_id: populatedProject.creator_id ? populatedProject.creator_id.id : null,
    };

    res.json({ message: 'Project updated successfully.', project: formattedProject });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found.',
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner =
      project.creator_id.toString() === req.user.id;
//  only owner or admin can delete project
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: 'Not authorized to delete this project.',
      });
    }

    await project.deleteOne();

    res.json({
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    console.error('Delete project error:', error);

    res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
