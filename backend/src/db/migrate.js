import db from '../config/db.js';

const schema = `
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    role VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'DRIVER', 'ADMIN')),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Vehicles table
  CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL,
    plate VARCHAR(20) NOT NULL,
    model VARCHAR(100),
    color VARCHAR(50),
    type VARCHAR(50),
    CONSTRAINT fk_vehicle_driver
      FOREIGN KEY (driver_id) REFERENCES users (id) ON DELETE CASCADE
  );

  -- Rides table
  CREATE TABLE IF NOT EXISTS rides (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    driver_id INTEGER,
    status VARCHAR(20) NOT NULL
      CHECK (status IN ('REQUESTED', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT NOT NULL,
    scheduled_for TIMESTAMP,
    estimated_price NUMERIC(10,2),
    final_price NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_ride_customer FOREIGN KEY (customer_id) REFERENCES users (id),
    CONSTRAINT fk_ride_driver FOREIGN KEY (driver_id) REFERENCES users (id)
  );

  -- Create indexes for better query performance
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_rides_customer ON rides(customer_id);
  CREATE INDEX IF NOT EXISTS idx_rides_driver ON rides(driver_id);
  CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
`;

async function migrate() {
  try {
    console.log('Starting database migration...');
    await db.query(schema);
    console.log('✅ Migration completed successfully!');
    
    // Verify tables were created
    const result = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\nCreated tables:');
    result.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  migrate();
}

export default migrate;
export { schema };
