const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

// GET /api/todos - list, newest first
router.get('/', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

// POST /api/todos - create { title }
router.post('/', async (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todo = await Todo.create({ title });
  res.status(201).json(todo);
});

// PATCH /api/todos/:id - update { completed }
router.patch('/:id', async (req, res) => {
  const update = {};
  if (typeof req.body.completed === 'boolean') {
    update.completed = req.body.completed;
  }
  const todo = await Todo.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.json(todo);
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

module.exports = router;
