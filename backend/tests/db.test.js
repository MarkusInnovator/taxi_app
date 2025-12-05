import db from '../src/config/db.js';
import migrate from '../src/db/migrate.js';
import resetDatabase from '../src/db/reset.js';

// Check if database is available
let dbAvailable = false;

beforeAll(async () => {
  try {
    await db.query('SELECT 1');
    dbAvailable = true;
    // Reset database before running tests
    await resetDatabase();
  } catch (error) {
    console.log('⚠️  Database not available, skipping DB tests');
  }
});

afterAll(async () => {
  if (dbAvailable) {
    await db.end();
  }
});

describe('Database Migration', () => {
  describe('migrate()', () => {
    it('should create all required tables', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      await migrate();

      // Check if users table exists
      const usersResult = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      expect(usersResult.rows[0].exists).toBe(true);

      // Check if vehicles table exists
      const vehiclesResult = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'vehicles'
        );
      `);
      expect(vehiclesResult.rows[0].exists).toBe(true);

      // Check if rides table exists
      const ridesResult = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'rides'
        );
      `);
      expect(ridesResult.rows[0].exists).toBe(true);
    });

    it('should create users table with correct columns', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const result = await db.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);

      const columnNames = result.rows.map(row => row.column_name);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('role');
      expect(columnNames).toContain('name');
      expect(columnNames).toContain('email');
      expect(columnNames).toContain('password_hash');
      expect(columnNames).toContain('phone');
      expect(columnNames).toContain('created_at');
    });

    it('should allow inserting a test user', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      const result = await db.query(`
        INSERT INTO users (role, name, email, password_hash, phone)
        VALUES ('CUSTOMER', 'Test User', 'test@example.com', 'hashed_password', '1234567890')
        RETURNING id, name, email, role;
      `);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].name).toBe('Test User');
      expect(result.rows[0].email).toBe('test@example.com');
      expect(result.rows[0].role).toBe('CUSTOMER');
    });

    it('should enforce role constraint', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      await expect(
        db.query(`
          INSERT INTO users (role, name, email, password_hash)
          VALUES ('INVALID_ROLE', 'Test', 'invalid@test.com', 'hash');
        `)
      ).rejects.toThrow();
    });

    it('should enforce unique email constraint', async () => {
      if (!dbAvailable) {
        console.log('Skipping test - database not available');
        return;
      }

      // First insert should succeed
      await db.query(`
        INSERT INTO users (role, name, email, password_hash)
        VALUES ('CUSTOMER', 'User 1', 'unique@test.com', 'hash1');
      `);

      // Second insert with same email should fail
      await expect(
        db.query(`
          INSERT INTO users (role, name, email, password_hash)
          VALUES ('CUSTOMER', 'User 2', 'unique@test.com', 'hash2');
        `)
      ).rejects.toThrow();
    });
  });
});
