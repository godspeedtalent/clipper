import { spawn } from 'child_process';
import { db } from '../../../lib/db';
import { analyzeVideos } from '../../../lib/analyze';

export default function handler(req, res) {
  analyzeVideos();
  const { id } = req.query;
  db.get('SELECT * FROM clips WHERE id = ?', [id], (err, row) => {
    if (err || !row) return res.status(404).end();
    const args = ['-ss', row.start.toString(), '-to', row.end.toString(), '-i', row.file, '-f', 'mp4', '-movflags', 'frag_keyframe+empty_moov', 'pipe:1'];
    const ff = spawn('ffmpeg', args);
    res.setHeader('Content-Type', 'video/mp4');
    ff.stdout.pipe(res);
  });
}
