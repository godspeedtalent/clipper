import { loadConfig, saveConfig } from '../../lib/config';
import { analyzeVideos } from '../../lib/analyze';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const config = loadConfig();
    return res.status(200).json(config);
  }
  if (req.method === 'POST') {
    const { videosDir } = req.body || {};
    if (!videosDir || typeof videosDir !== 'string') {
      return res.status(400).json({ error: 'Invalid videosDir' });
    }
    saveConfig({ videosDir });
    analyzeVideos();
    return res.status(200).json({ videosDir });
  }
  res.status(405).end();
}
