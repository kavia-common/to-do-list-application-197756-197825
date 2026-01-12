'use strict';

const tasksService = require('../services/tasks');
const {
  isNonEmptyString,
  normalizeNullableString,
  parseOptionalDateTime,
  normalizeIsCompleted,
} = require('../utils/validation');

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

      if (!isNonEmptyString(title)) {
        return res.status(400).json({ message: 'title is required and must be a non-empty string' });
      }

      const normalizedDescription = normalizeNullableString(description);
      if (normalizedDescription === undefined && description !== undefined) {
        return res.status(400).json({ message: 'description must be a string or null when provided' });
      }

      const dueDateParsed = parseOptionalDateTime(due_date);
      if (!dueDateParsed.ok) {
        return res.status(400).json({ message: dueDateParsed.message });
      }

      const created = await tasksService.createTask({
        title: title.trim(),
        description: normalizedDescription === undefined ? null : normalizedDescription,
        due_date: dueDateParsed.value === undefined ? null : dueDateParsed.value,
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

      const body = req.body || {};
      const { title, description, due_date, is_completed } = body;

      // Disallow completely empty updates (common client mistake).
      if (Object.keys(body).length === 0) {
        return res.status(400).json({ message: 'Request body must include at least one updatable field' });
      }

      if (title !== undefined && !isNonEmptyString(title)) {
        return res.status(400).json({ message: 'title must be a non-empty string when provided' });
      }

      const normalizedDescription = normalizeNullableString(description);
      if (normalizedDescription === undefined && description !== undefined) {
        return res.status(400).json({ message: 'description must be a string or null when provided' });
      }

      const dueDateParsed = parseOptionalDateTime(due_date);
      if (!dueDateParsed.ok) {
        return res.status(400).json({ message: dueDateParsed.message });
      }

      const normalizedCompleted = normalizeIsCompleted(is_completed);
      if (normalizedCompleted === undefined && is_completed !== undefined) {
        return res.status(400).json({ message: 'is_completed must be a boolean (or 0/1) when provided' });
      }

      const updated = await tasksService.updateTask(id, {
        title: title !== undefined ? title.trim() : undefined,
        description: normalizedDescription,
        due_date: dueDateParsed.value,
        is_completed: normalizedCompleted,
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
