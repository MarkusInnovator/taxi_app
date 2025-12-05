import 'dotenv/config';

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];

function validateEnv() {
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using defaults for development...');
  }
}

validateEnv();

const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/taxiflow',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
};

export default config;
