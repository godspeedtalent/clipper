import { db } from '../../lib/db';
import { analyzeVideos } from '../../lib/analyze';

export default function handler(req, res) {
  analyzeVideos();
  db.all('SELECT id FROM clips ORDER BY id', (err, rows) => {
    if (err) return res.status(500).json({ error: err.toString() });
    const clips = rows.map(r => r.id);
    res.status(200).json({ clips });
  });
}
