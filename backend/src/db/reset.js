import db from '../config/db.js';

async function resetDatabase() {
  try {
    console.log('Resetting test database...');
    
    // Drop all tables
    await db.query(`
      DROP TABLE IF EXISTS rides CASCADE;
      DROP TABLE IF EXISTS vehicles CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    
    console.log('✅ Database reset complete');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    throw error;
  }
}

export default resetDatabase;
