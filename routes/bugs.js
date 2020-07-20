const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

// const User = require('../models/User');
const Bug = require('../models/Bug');

// @route   GET api/bugs
// @desc    Get all the users bugs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bugs = await Bug.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(bugs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/bugs
// @desc    Add new bugs
// @access  Private
// put auth in the middle to make it private
router.post(
  '/',
  auth,
  [
    [check('title', 'Title is required').not().isEmpty()],
    [check('priority', 'Priority is required')],
    [check('status', 'Status is required')],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, priority, projectName, description, status } = req.body;
    try {
      const newBug = new Bug({
        title,
        priority,
        projectName,
        description,
        status,
        user: req.user.id,
      });
      const bug = await newBug.save();
      res.json(bug);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/bugs/:id
// @desc    Update Bugs
// @access  Private
router.put('/:id', (req, res) => {
  res.send('Update Bug');
});

// @route   DELETE api/bugs/:id
// @desc    Delete Bugs
// @access  Private
router.delete('/:id', (req, res) => {
  res.send('Delete Bug');
});

module.exports = router;
