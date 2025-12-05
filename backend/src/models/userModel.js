import db from '../config/db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const userModel = {
  async create({ name, email, password, role = 'CUSTOMER', phone = null }) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    const result = await db.query(
      `INSERT INTO users (role, name, email, password_hash, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, role, name, email, phone, created_at`,
      [role, name, email, passwordHash, phone]
    );
    
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await db.query(
      'SELECT id, role, name, email, phone, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async verifyPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  },

  async updateRole(id, newRole) {
    const result = await db.query(
      `UPDATE users SET role = $1 WHERE id = $2
       RETURNING id, role, name, email, phone, created_at`,
      [newRole, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  },

  async getAll() {
    const result = await db.query(
      'SELECT id, role, name, email, phone, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  }
};

export default userModel;
