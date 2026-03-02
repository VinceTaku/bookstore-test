import Database from 'better-sqlite3';
import path    from 'path';
import dotenv  from 'dotenv';

dotenv.config();

// I store the database file in the root of my project
// I use environment variables so the name can be changed
// without touching the code
const DB_NAME = process.env.DB_NAME || 'bookstore.db';
const DB_PATH = path.join(__dirname, '../../', DB_NAME);

// I create the database connection here
// and reuse it across all repository files
const db = new Database(DB_PATH);

// I enable foreign keys to ensure
// data integrity across tables
db.pragma('foreign_keys = ON');

// I create the books table here
// I chose to store genre as a string
// because the discount is provided
// per request not stored in database
// this keeps the structure simple
const initDB = (): void => {

  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id         INTEGER       PRIMARY KEY AUTOINCREMENT,
      title      VARCHAR(255)  NOT NULL,
      author     VARCHAR(255)  NOT NULL,
      genre      VARCHAR(255)  NOT NULL,
      price      DECIMAL(10,2) NOT NULL,
      stock      INTEGER       NOT NULL DEFAULT 0,
      created_at DATETIME      DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('I have initialised the database successfully!');
  console.log(`Database location: ${DB_PATH}`);
};

// I run the table creation when app starts
initDB();

// I export db so any repository file
// can import and use it to query
export default db;