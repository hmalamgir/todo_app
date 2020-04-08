const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');

const Todo = require('../models/Todo');
const User = require('../models/User');

// @route    GET api/todos
// @desc     Get all users todos
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      success: false,
      message: 'Server Error'
    });
  }
});

// @route    POST api/todos
// @desc     Add new todo
// @access   Private
router.post(
  '/',
  [auth, [check('todo', 'Todo is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // set user to req body
      req.body.user = req.user.id;

      const todo = await Todo.create(req.body);
      res.json({
        success: true,
        data: todo
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({
        success: false,
        message: 'Server Error'
      });
    }
  }
);

// @route    PUT api/todos/:id
// @desc     Update todo
// @access   Private
router.put('/:id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ msg: 'Todo not found' });

    // Make sure user owns contact
    if (todo.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.json({
      success: true,
      data: todo
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      success: false,
      message: 'Server Error'
    });
  }
});

// @route    DELETE api/todos/:id
// @desc     Delete todo
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ msg: 'todo not found' });

    // Make sure user owns todo
    if (todo.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    await Todo.findByIdAndRemove(req.params.id);

    res.json({
      success: true,
      msg: 'todo removed'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;
