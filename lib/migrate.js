const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { db, getVideosDir } = require('./db');

function migrate() {
  const videosDir = getVideosDir();
  const files = fs.readdirSync(videosDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.mp4', '.mov', '.webm', '.mkv'].includes(ext);
  });
  const total = files.length;
  files.forEach((file, index) => {
    const filePath = path.join(videosDir, file);
    process.stdout.write(`Processing ${index + 1}/${total}: ${file}    \r`);
    const probe = spawnSync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filePath
    ], { encoding: 'utf8' });
    if (probe.status !== 0) {
      console.error(`Error analyzing ${file}: ${probe.stderr.trim()}`);
      return;
    }
    const duration = parseFloat(probe.stdout);
    if (isNaN(duration)) {
      console.error(`Error processing ${file}: invalid duration`);
      return;
    }
    const clipCount = Math.ceil(duration / 30);
    db.serialize(() => {
      const stmt = db.prepare('INSERT INTO clips (file, start, end) VALUES (?, ?, ?)');
      for (let i = 0; i < clipCount; i++) {
        const start = i * 30;
        const end = Math.min((i + 1) * 30, duration);
        stmt.run(filePath, start, end);
      }
      stmt.finalize();
    });
  });
  console.log('\nMigration complete.');
}

if (require.main === module) {
  migrate();
}

module.exports = { migrate };
