'use strict';

const pool = require('../db/pool');

class TasksService {
  _normalizeTaskRow(row) {
    if (!row) return row;
    return {
      ...row,
      // Frontend-friendly: always boolean (DB stores tinyint 0/1).
      is_completed: Boolean(row.is_completed),
    };
  }

  // PUBLIC_INTERFACE
  async listTasks() {
    /** List all tasks ordered by most recently modified first. */
    const [rows] = await pool.query(
      `SELECT 
         uid,
         title,
         description,
         is_completed,
         due_date,
         created_date,
         modified_date
       FROM tasks
       ORDER BY modified_date DESC, uid DESC`
    );
    return rows.map((r) => this._normalizeTaskRow(r));
  }

  // PUBLIC_INTERFACE
  async createTask({ title, description, due_date }) {
    /** Create a task and return the created row. */
    const [result] = await pool.execute(
      `INSERT INTO tasks (title, description, is_completed, due_date)
       VALUES (?, ?, 0, ?)`,
      [title, description || null, due_date || null]
    );

    const uid = result.insertId;
    return this.getTaskById(uid);
  }

  // PUBLIC_INTERFACE
  async getTaskById(id) {
    /** Fetch a single task by uid. Returns null if not found. */
    const [rows] = await pool.execute(
      `SELECT 
         uid,
         title,
         description,
         is_completed,
         due_date,
         created_date,
         modified_date
       FROM tasks
       WHERE uid = ?`,
      [id]
    );
    return this._normalizeTaskRow(rows[0] || null);
  }

  // PUBLIC_INTERFACE
  async updateTask(id, { title, description, due_date, is_completed }) {
    /**
     * Partial update of mutable fields.
     * Any field passed as undefined will not be overwritten.
     */
    const existing = await this.getTaskById(id);
    if (!existing) return null;

    const nextTitle = title !== undefined ? title : existing.title;
    const nextDescription = description !== undefined ? description : existing.description;
    const nextDueDate = due_date !== undefined ? due_date : existing.due_date;
    const nextCompleted = is_completed !== undefined ? is_completed : existing.is_completed;

    await pool.execute(
      `UPDATE tasks
       SET title = ?, description = ?, due_date = ?, is_completed = ?
       WHERE uid = ?`,
      [nextTitle, nextDescription || null, nextDueDate || null, Number(Boolean(nextCompleted)), id]
    );

    return this.getTaskById(id);
  }

  // PUBLIC_INTERFACE
  async deleteTask(id) {
    /** Delete a task. Returns true if deleted, false if not found. */
    const [result] = await pool.execute('DELETE FROM tasks WHERE uid = ?', [id]);
    return result.affectedRows > 0;
  }

  // PUBLIC_INTERFACE
  async markComplete(id) {
    /** Mark a task completed (idempotent). Returns updated row or null if not found. */
    const [result] = await pool.execute(
      `UPDATE tasks
       SET is_completed = 1
       WHERE uid = ?`,
      [id]
    );
    if (result.affectedRows === 0) return null;
    return this.getTaskById(id);
  }

  // PUBLIC_INTERFACE
  async pingDatabase() {
    /** Verify DB connectivity with a lightweight round-trip query. */
    const [rows] = await pool.query('SELECT 1 AS ok');
    return rows && rows[0] && rows[0].ok === 1;
  }
}

module.exports = new TasksService();
