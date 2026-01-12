'use strict';

const tasksService = require('../services/tasks');

class TasksController {
  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** Express handler: list tasks. */
    try {
      const tasks = await tasksService.listTasks();
      return res.status(200).json(tasks);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Express handler: create task. */
    try {
      const { title, description, due_date } = req.body || {};

      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ message: 'title is required and must be a non-empty string' });
      }

      const created = await tasksService.createTask({
        title: title.trim(),
        description: typeof description === 'string' ? description : null,
        due_date: due_date || null
      });

      return res.status(201).json(created);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Express handler: update task fields by id. */
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ message: 'id must be a number' });
      }

      const { title, description, due_date, is_completed } = req.body || {};

      if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
        return res.status(400).json({ message: 'title must be a non-empty string when provided' });
      }
      if (description !== undefined && description !== null && typeof description !== 'string') {
        return res.status(400).json({ message: 'description must be a string or null when provided' });
      }
      if (is_completed !== undefined && typeof is_completed !== 'boolean' && is_completed !== 0 && is_completed !== 1) {
        return res.status(400).json({ message: 'is_completed must be a boolean (or 0/1) when provided' });
      }

      const updated = await tasksService.updateTask(id, {
        title: title !== undefined ? title.trim() : undefined,
        description,
        due_date,
        is_completed: is_completed === 1 ? true : is_completed === 0 ? false : is_completed
      });

      if (!updated) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Express handler: delete task by id. */
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ message: 'id must be a number' });
      }

      const deleted = await tasksService.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async complete(req, res, next) {
    /** Express handler: mark task complete by id. */
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ message: 'id must be a number' });
      }

      const updated = await tasksService.markComplete(id);
      if (!updated) {
        return res.status(404).json({ message: 'Task not found' });
      }

      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new TasksController();
