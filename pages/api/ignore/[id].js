import { db } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id } = req.query;
  db.serialize(() => {
    db.run('DELETE FROM clips WHERE id = ?', [id]);
    db.run('DELETE FROM favorites WHERE clip_id = ?', [id]);
  });
  res.status(200).end();
}
