import Database from "better-sqlite3";
import path from "path";

// Database stored at project root
const DB_PATH = path.join(process.cwd(), "pawfix.db");

let db: Database.Database | null = null;

/** Get or create the SQLite database connection */
function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initTables(db);
  }
  return db;
}

/** Create tables if they don't exist */
function initTables(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS queries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_input TEXT NOT NULL,
      type TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS food_database (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      safe TEXT NOT NULL CHECK(safe IN ('safe','unsafe','limited')),
      notes TEXT
    );
  `);
}

/** Save a query and its AI response */
export function saveQuery(userInput: string, type: string, response: string) {
  try {
    const database = getDb();
    const stmt = database.prepare(
      "INSERT INTO queries (user_input, type, response) VALUES (?, ?, ?)"
    );
    stmt.run(userInput, type, response);
  } catch (error) {
    // DB errors should never break the user experience
    console.error("Failed to save query:", error);
  }
}

/** Get recent queries (for potential history feature) */
export function getRecentQueries(limit = 10) {
  try {
    const database = getDb();
    const stmt = database.prepare(
      "SELECT * FROM queries ORDER BY created_at DESC LIMIT ?"
    );
    return stmt.all(limit);
  } catch {
    return [];
  }
}

export default getDb;
