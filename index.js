const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
app.use(express.static('public'));

const DB_FILE = 'clips.db';
const VIDEOS_DIR = process.env.VIDEOS_DIR
  ? path.resolve(process.env.VIDEOS_DIR)
  : path.join(__dirname, 'videos');

// ensure the videos directory exists so readdirSync doesn't throw
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}
const CLIPS_TABLE = `CREATE TABLE IF NOT EXISTS clips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file TEXT,
  start REAL,
  end REAL,
  rating INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0
)`;
const db = new sqlite3.Database(DB_FILE);
db.serialize(() => {
  db.run(CLIPS_TABLE);
});

function analyzeVideos() {
  const files = fs.readdirSync(VIDEOS_DIR);
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (!['.mp4', '.mov', '.webm', '.mkv'].includes(ext)) return;
    const filePath = path.join(VIDEOS_DIR, file);
    // use ffprobe to get duration
    const probe = spawn('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', filePath]);
    let data = '';
    probe.stdout.on('data', chunk => data += chunk);
    probe.on('close', () => {
      const duration = parseFloat(data);
      if (isNaN(duration)) return;
      const clipCount = Math.ceil(duration / 30);
      db.serialize(() => {
        for (let i = 0; i < clipCount; i++) {
          const start = i * 30;
          const end = Math.min((i + 1) * 30, duration);
          db.run('INSERT INTO clips (file, start, end) VALUES (?, ?, ?)', [filePath, start, end]);
        }
      });
    });
  });
}

function pickClip(callback) {
  db.all('SELECT * FROM clips', (err, rows) => {
    if (err) return callback(err);
    if (rows.length === 0) return callback(new Error('No clips'));
    // weight clips by rating+1 to prioritize high rated and new clips
    const weighted = [];
    rows.forEach(row => {
      if (row.rating < -5) return; // skip badly rated
      const weight = Math.max(1, row.rating + 1);
      for (let i = 0; i < weight; i++) weighted.push(row);
    });
    const clip = weighted[Math.floor(Math.random() * weighted.length)];
    callback(null, clip);
  });
}

app.get('/random', (req, res) => {
  pickClip((err, clip) => {
    if (err) return res.status(500).send(err.toString());
    res.json(clip);
  });
});

app.get('/clip/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM clips WHERE id = ?', [id], (err, row) => {
    if (err || !row) return res.status(404).end();
    const args = ['-ss', row.start.toString(), '-to', row.end.toString(), '-i', row.file, '-f', 'mp4', '-movflags', 'frag_keyframe+empty_moov', 'pipe:1'];
    const ff = spawn('ffmpeg', args);
    res.type('video/mp4');
    ff.stdout.pipe(res);
  });
});

app.post('/watch/:id', express.json(), (req, res) => {
  const id = req.params.id;
  const watched = req.body.watched || 0;
  const rating = watched > 25 ? 1 : watched < 5 ? -1 : 0;
  db.run('UPDATE clips SET views = views + 1, rating = rating + ? WHERE id = ?', [rating, id]);
  res.end();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  analyzeVideos();
});
