import { db } from '../../../lib/db';

export default function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    db.get('SELECT 1 FROM favorites WHERE clip_id = ?', [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.toString() });
      res.status(200).json({ favorite: !!row });
    });
    return;
  }
  if (req.method === 'POST') {
    const { action } = req.body || {};
    if (action === 'add') {
      db.run('INSERT OR IGNORE INTO favorites (clip_id) VALUES (?)', [id], err => {
        if (err) return res.status(500).json({ error: err.toString() });
        res.status(200).end();
      });
      return;
    }
    if (action === 'remove') {
      db.run('DELETE FROM favorites WHERE clip_id = ?', [id], err => {
        if (err) return res.status(500).json({ error: err.toString() });
        res.status(200).end();
      });
      return;
    }
    return res.status(400).json({ error: 'Invalid action' });
  }
  res.status(405).end();
}
