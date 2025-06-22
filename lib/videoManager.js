const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { db, VIDEOS_DIR } = require('./db');

function addWebVideo(url) {
  db.run('INSERT INTO clips (file, start, end, type) VALUES (?, 0, 0, ?)', [url, 'web']);
}

function addLocalVideo(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.mp4', '.mov', '.webm', '.mkv'].includes(ext)) return;
  const filePath = path.join(VIDEOS_DIR, file);
  if (!fs.existsSync(filePath)) return;

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
}

module.exports = { addWebVideo, addLocalVideo };
