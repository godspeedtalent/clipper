const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(process.cwd(), 'config.json');
const DEFAULT_DIR = path.join(process.cwd(), 'videos');

function loadConfig() {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    const json = JSON.parse(data);
    return { videosDir: json.videosDir || DEFAULT_DIR };
  } catch (e) {
    return { videosDir: DEFAULT_DIR };
  }
}

function saveConfig(config) {
  const data = { videosDir: config.videosDir || DEFAULT_DIR };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

module.exports = { loadConfig, saveConfig };
