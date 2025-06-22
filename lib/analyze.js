const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { db, VIDEOS_DIR } = require('./db');

let analyzed = false;

function analyzeVideos() {
  if (analyzed) return;
  analyzed = true;

  const files = fs.readdirSync(VIDEOS_DIR);
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (!['.mp4', '.mov', '.webm', '.mkv'].includes(ext)) return;
    const filePath = path.join(VIDEOS_DIR, file);

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
          db.run('INSERT INTO clips (file, start, end, type) VALUES (?, ?, ?, ?)', [filePath, start, end, 'local']);
        }
      });
    });
  });
}

module.exports = { analyzeVideos };
