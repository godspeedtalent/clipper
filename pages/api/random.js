import { db } from '../../lib/db';
import { analyzeVideos } from '../../lib/analyze';

export default function handler(req, res) {
  analyzeVideos();
  db.all('SELECT * FROM clips', (err, rows) => {
    if (err) return res.status(500).json({ error: err.toString() });
    if (rows.length === 0) return res.status(404).json({ error: 'No clips' });
    const weighted = [];
    rows.forEach(row => {
      if (row.rating < -5) return;
      const weight = Math.max(1, row.rating + 1);
      for (let i = 0; i < weight; i++) weighted.push(row);
    });
    const clip = weighted[Math.floor(Math.random() * weighted.length)];
    res.status(200).json(clip);
  });
}
