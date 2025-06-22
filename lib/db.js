const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { loadConfig } = require('./config');

const DB_FILE = path.join(process.cwd(), 'clips.db');
function getVideosDir() {
  const { videosDir } = loadConfig();
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }
  return videosDir;
}

// ensure directory exists on first use
getVideosDir();

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS clips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file TEXT,
    start REAL,
    end REAL,
    rating INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0
  )`);
});

module.exports = { db, getVideosDir };
