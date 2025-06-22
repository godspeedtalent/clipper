import { db } from '../../../lib/db';
import { analyzeVideos } from '../../../lib/analyze';

export default function handler(req, res) {
  analyzeVideos();
  const { id } = req.query;
  const watched = (req.body && req.body.watched) || 0;
  const rating = watched > 25 ? 1 : watched < 5 ? -1 : 0;
  db.run('UPDATE clips SET views = views + 1, rating = rating + ? WHERE id = ?', [rating, id]);
  res.status(200).end();
}
