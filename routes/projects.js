const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Project = require('../models/Project');

// @route   GET api/projects
// @desc    Get all the users projects
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user.id,
    });
    res.json(projects);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Add new project
// @access  Private
router.post(
  '/',
  auth,
  [[check('title', 'Title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    try {
      const newProject = new Project({
        title,
        description,
        user: req.user.id,
      });
      const project = await newProject.save();
      res.json(project);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET current api/projects
// @desc   Load the users current project
// @access  Private
router.get('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    res.json(project);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update the CURRENT PROJECT
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, users } = req.body;
  let user = await Project.findOne({ _id: req.params.id, user: req.user.id });
  console.log(user);
  if (!user) {
    return res
      .status(400)
      .json({ msg: 'You are not allowed to edit this project!' });
  }
  var newAddedUser;
  if (users) {
    newAddedUser = users[users.length - 1];
  }

  console.log(newAddedUser);
  // Build Project object
  const projectFields = {};
  if (title) projectFields.title = title;
  if (description) projectFields.description = description;
  if (users) {
    var newAddedUser1 = await User.findOne({ email: newAddedUser });
    var newAddedUser2 = await Project.findOne({
      _id: req.params.id,
      users: newAddedUser,
    });
    console.log(newAddedUser2);
    if (newAddedUser1 === null) {
      return res.status(400).json({ msg: 'User does not exist' });
    } else if (newAddedUser2) {
      return res.status(400).json({ msg: 'User already added' });
    } else {
      projectFields.users = users;
    }
  }
  try {
    let project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: 'Project not Found' });

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
