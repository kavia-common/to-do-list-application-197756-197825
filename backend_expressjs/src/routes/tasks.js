'use strict';

const express = require('express');
const tasksController = require('../controllers/tasks');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Task management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         uid:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Buy groceries
 *         description:
 *           type: string
 *           nullable: true
 *           example: Milk, eggs, bread
 *         is_completed:
 *           type: integer
 *           description: Stored as 0/1 in MySQL
 *           example: 0
 *         due_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-01-31T12:00:00.000Z
 *         created_date:
 *           type: string
 *           format: date-time
 *         modified_date:
 *           type: string
 *           format: date-time
 *     TaskCreateRequest:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           example: Buy groceries
 *         description:
 *           type: string
 *           nullable: true
 *           example: Milk, eggs, bread
 *         due_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-01-31T12:00:00.000Z
 *     TaskUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Buy groceries and fruits
 *         description:
 *           type: string
 *           nullable: true
 *           example: Milk, eggs, bread, apples
 *         due_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-01-31T12:00:00.000Z
 *         is_completed:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks
 *     description: Returns all tasks.
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', tasksController.list.bind(tasksController));

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create task
 *     description: Creates a new task in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateRequest'
 *     responses:
 *       201:
 *         description: Created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 */
router.post('/', tasksController.create.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update task
 *     description: Updates an existing task (fields provided will be overwritten).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.put('/:id', tasksController.update.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
 *     description: Deletes a task by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Task not found
 */
router.delete('/:id', tasksController.remove.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}/complete:
 *   patch:
 *     tags: [Tasks]
 *     summary: Mark task complete
 *     description: Marks a task as completed.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.patch('/:id/complete', tasksController.complete.bind(tasksController));

module.exports = router;
