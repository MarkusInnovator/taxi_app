import pool from '../config/db.js';
import bcrypt from 'bcrypt';

/**
 * Seeds database with demo accounts for testing
 */
async function seedDatabase() {
  console.log('🌱 Seeding database with demo data...');

  try {
    // Check if users already exist
    const existingUsers = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log('⚠️  Database already has users. Skipping seed.');
      console.log('💡 Run npm run db:reset first to clear the database.');
      return;
    }

    // Hash passwords
    const customerPassword = await bcrypt.hash('customer123', 10);
    const driverPassword = await bcrypt.hash('driver123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    // Create demo users
    const users = [
      {
        email: 'customer@taxi.com',
        password: customerPassword,
        name: 'John Customer',
        role: 'CUSTOMER'
      },
      {
        email: 'driver@taxi.com',
        password: driverPassword,
        name: 'Mike Driver',
        role: 'DRIVER'
      },
      {
        email: 'admin@taxi.com',
        password: adminPassword,
        name: 'Sarah Admin',
        role: 'ADMIN'
      },
      {
        email: 'customer2@taxi.com',
        password: customerPassword,
        name: 'Jane Customer',
        role: 'CUSTOMER'
      },
      {
        email: 'driver2@taxi.com',
        password: driverPassword,
        name: 'Tom Driver',
        role: 'DRIVER'
      }
    ];

    console.log('👥 Creating demo users...');
    const insertedUsers = [];
    
    for (const user of users) {
      const result = await pool.query(
        'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [user.email, user.password, user.name, user.role]
      );
      insertedUsers.push(result.rows[0]);
      console.log(`   ✅ Created ${user.role}: ${user.email}`);
    }

    // Create some demo rides
    console.log('🚕 Creating demo rides...');
    
    const customer1Id = insertedUsers.find(u => u.email === 'customer@taxi.com').id;
    const customer2Id = insertedUsers.find(u => u.email === 'customer2@taxi.com').id;
    const driver1Id = insertedUsers.find(u => u.email === 'driver@taxi.com').id;

    const rides = [
      {
        customer_id: customer1Id,
        driver_id: null,
        pickup_address: 'Hauptbahnhof München',
        dropoff_address: 'Flughafen München',
        status: 'REQUESTED',
        estimated_price: 45.00,
        scheduled_for: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      },
      {
        customer_id: customer1Id,
        driver_id: driver1Id,
        pickup_address: 'Marienplatz München',
        dropoff_address: 'BMW Welt',
        status: 'COMPLETED',
        estimated_price: 25.00,
        final_price: 27.50,
        scheduled_for: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        customer_id: customer2Id,
        driver_id: driver1Id,
        pickup_address: 'Olympiapark München',
        dropoff_address: 'Allianz Arena',
        status: 'ACCEPTED',
        estimated_price: 30.00,
        scheduled_for: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour from now
      },
      {
        customer_id: customer2Id,
        driver_id: null,
        pickup_address: 'Karlsplatz Stachus',
        dropoff_address: 'Englischer Garten',
        status: 'REQUESTED',
        estimated_price: 18.00,
        scheduled_for: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
      },
      {
        customer_id: customer1Id,
        driver_id: driver1Id,
        pickup_address: 'Sendlinger Tor',
        dropoff_address: 'Hauptbahnhof',
        status: 'COMPLETED',
        estimated_price: 12.00,
        final_price: 12.00,
        scheduled_for: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
      }
    ];

    for (const ride of rides) {
      const query = `
        INSERT INTO rides (
          customer_id, driver_id, pickup_address, dropoff_address, 
          status, estimated_price, final_price, scheduled_for
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      await pool.query(query, [
        ride.customer_id,
        ride.driver_id,
        ride.pickup_address,
        ride.dropoff_address,
        ride.status,
        ride.estimated_price,
        ride.final_price || null,
        ride.scheduled_for
      ]);
      
      console.log(`   ✅ Created ride: ${ride.pickup_address} → ${ride.dropoff_address} (${ride.status})`);
    }

    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📋 Demo Accounts:');
    console.log('   Customer: customer@taxi.com / customer123');
    console.log('   Driver:   driver@taxi.com / driver123');
    console.log('   Admin:    admin@taxi.com / admin123');
    console.log('');
    console.log('📊 Demo Data:');
    console.log(`   Users: ${insertedUsers.length}`);
    console.log(`   Rides: ${rides.length}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedDatabase;
