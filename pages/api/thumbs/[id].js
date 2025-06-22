import { db } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id } = req.query;
  const { action } = req.body || {};
  let delta = 0;
  if (action === 'up') delta = 5;
  else if (action === 'down') delta = -5;
  else return res.status(400).json({ error: 'Invalid action' });
  db.run('UPDATE clips SET rating = rating + ? WHERE id = ?', [delta, id], err => {
    if (err) return res.status(500).json({ error: err.toString() });
    res.status(200).end();
  });
}
