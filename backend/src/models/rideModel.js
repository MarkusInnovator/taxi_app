import db from '../config/db.js';

const rideModel = {
  async create({ customerId, pickupAddress, dropoffAddress, scheduledFor, estimatedPrice }) {
    const result = await db.query(
      `INSERT INTO rides (customer_id, status, pickup_address, dropoff_address, scheduled_for, estimated_price)
       VALUES ($1, 'REQUESTED', $2, $3, $4, $5)
       RETURNING *`,
      [customerId, pickupAddress, dropoffAddress, scheduledFor, estimatedPrice]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await db.query(
      `SELECT r.*, 
              c.name as customer_name, c.email as customer_email, c.phone as customer_phone,
              d.name as driver_name, d.email as driver_email, d.phone as driver_phone
       FROM rides r
       LEFT JOIN users c ON r.customer_id = c.id
       LEFT JOIN users d ON r.driver_id = d.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findByCustomerId(customerId) {
    const result = await db.query(
      `SELECT r.*,
              d.name as driver_name, d.phone as driver_phone
       FROM rides r
       LEFT JOIN users d ON r.driver_id = d.id
       WHERE r.customer_id = $1
       ORDER BY r.created_at DESC`,
      [customerId]
    );
    return result.rows;
  },

  async findByDriverId(driverId) {
    const result = await db.query(
      `SELECT r.*,
              c.name as customer_name, c.phone as customer_phone
       FROM rides r
       LEFT JOIN users c ON r.customer_id = c.id
       WHERE r.driver_id = $1
       ORDER BY r.created_at DESC`,
      [driverId]
    );
    return result.rows;
  },

  async findOpenRides() {
    const result = await db.query(
      `SELECT r.*,
              c.name as customer_name, c.phone as customer_phone
       FROM rides r
       JOIN users c ON r.customer_id = c.id
       WHERE r.status = 'REQUESTED'
       ORDER BY r.created_at ASC`
    );
    return result.rows;
  },

  async updateStatus(id, status, additionalData = {}) {
    const updateFields = ['status = $2', 'updated_at = NOW()'];
    const values = [id, status];
    let paramIndex = 3;

    if (additionalData.driverId !== undefined) {
      updateFields.push(`driver_id = $${paramIndex}`);
      values.push(additionalData.driverId);
      paramIndex++;
    }

    if (additionalData.finalPrice !== undefined) {
      updateFields.push(`final_price = $${paramIndex}`);
      values.push(additionalData.finalPrice);
      paramIndex++;
    }

    const query = `
      UPDATE rides 
      SET ${updateFields.join(', ')}
      WHERE id = $1
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async cancel(id) {
    return await this.updateStatus(id, 'CANCELLED');
  },

  async getAll() {
    const result = await db.query(
      `SELECT r.*,
              c.name as customer_name, c.email as customer_email,
              d.name as driver_name, d.email as driver_email
       FROM rides r
       LEFT JOIN users c ON r.customer_id = c.id
       LEFT JOIN users d ON r.driver_id = d.id
       ORDER BY r.created_at DESC`
    );
    return result.rows;
  }
};

export default rideModel;
