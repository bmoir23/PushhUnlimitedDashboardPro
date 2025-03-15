import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { log } from './vite';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  log('Starting database migration...', 'drizzle');
  
  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '../drizzle/0000_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      log('Executing migration...', 'drizzle');
      await client.query(migrationSQL);
      await client.query('COMMIT');
      log('Migration completed successfully!', 'drizzle');
    } catch (error) {
      await client.query('ROLLBACK');
      log(`Migration failed: ${error}`, 'drizzle');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    log(`Migration error: ${error}`, 'drizzle');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Execute migration if run directly
if (require.main === module) {
  migrate();
}

export { migrate };