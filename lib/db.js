const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_FILE = path.join(process.cwd(), 'clips.db');
const VIDEOS_DIR = path.join(process.cwd(), 'videos');

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS clips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file TEXT,
    start REAL,
    end REAL,
    rating INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    type TEXT DEFAULT 'local'
  )`);
});

module.exports = { db, VIDEOS_DIR };
