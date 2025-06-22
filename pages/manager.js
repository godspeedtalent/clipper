import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Manager() {
  const [clips, setClips] = useState([]);

  useEffect(() => {
    const fetchClips = async () => {
      const res = await fetch('/api/clips');
      if (res.ok) {
        const data = await res.json();
        setClips(data.clips || []);
      }
    };
    fetchClips();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <h1>Video Manager</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 10,
          margin: 20
        }}
      >
        {clips.map(id => (
          <video key={id} src={`/api/clip/${id}`} style={{ width: '100%' }} controls />
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <Link href="/">Home</Link>
      </div>
    </div>
  );
}
