import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
 
// Open (or create) a database file named "database.sqlite"
const dbPromise = open({
  filename: './database.sqlite',
  driver: sqlite3.Database,
});

/**
 * Initializes the database by creating the "users" table if it doesn't exist.
 * The table uses TEXT fields for both "id" and "dob".
 */
async function initializeDatabase() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      dob TEXT
    )
  `);
  console.log("SQLite database initialized and 'users' table is ready.");
}

// Run the database initialization on startup.
initializeDatabase();

/**
 * Retrieves the date of birth (dob) for a given user id.
 * @param {string} id - The user's id.
 * @returns {Promise<string|null>} The user's date of birth, or null if not found.
 */
export async function GetDOB(id) {
  const db = await dbPromise;
  const row = await db.get('SELECT dob FROM users WHERE id = ?', id);
  return row ? row.dob : null;
}

/**
 * Inserts a new user with the given id and dob.
 * @param {string} id - The user's id.
 * @param {string} dob - The user's date of birth.
 * @returns {Promise<Object>} The result of the insert operation.
 */
export async function AddDOB(id, dob) {
  const db = await dbPromise;
  const existingDOB = await GetDOB(id);
  
  if(existingDOB){
   await db.run('UPDATE users SET dob = ? WHERE id = ?', dob, id);
  }else{
   await db.run('INSERT INTO users (id, dob) VALUES (?, ?)', id, dob);
  }
}