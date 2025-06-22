import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [videosDir, setVideosDir] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setVideosDir(data.videosDir || '');
      }
    };
    fetchConfig();
  }, []);

  const save = async () => {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videosDir })
    });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>Settings</h1>
      <div>
        <input
          type="text"
          value={videosDir}
          onChange={e => setVideosDir(e.target.value)}
          style={{ width: '60%' }}
        />
        <button onClick={save} style={{ marginLeft: 10 }}>Save</button>
      </div>
      <div style={{ marginTop: 20 }}>
        <Link href="/">Home</Link>
      </div>
    </div>
  );
}
