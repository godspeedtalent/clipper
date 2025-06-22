import { useRef, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const videoRef = useRef(null);
  const [currentId, setCurrentId] = useState(null);
  const [voted, setVoted] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const loadRandom = async () => {
    const res = await fetch('/api/random');
    if (!res.ok) return;
    const clip = await res.json();
    setCurrentId(clip.id);
    setVoted(false);
    const favRes = await fetch(`/api/favorite/${clip.id}`);
    if (favRes.ok) {
      const data = await favRes.json();
      setFavorite(!!data.favorite);
    } else {
      setFavorite(false);
    }
    videoRef.current.src = `/api/clip/${clip.id}`;
    videoRef.current.play();
  };

  const sendWatch = async (watched) => {
    if (!currentId) return;
    await fetch(`/api/watch/${currentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ watched })
    });
  };

  const handleSkip = async () => {
    await sendWatch(videoRef.current.currentTime);
    loadRandom();
  };

  const handleEnded = async () => {
    await sendWatch(videoRef.current.duration);
    loadRandom();
  };

  const vote = async (dir) => {
    if (!currentId || voted) return;
    await fetch(`/api/thumbs/${currentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: dir })
    });
    setVoted(true);
  };

  const toggleFavorite = async () => {
    if (!currentId) return;
    const action = favorite ? 'remove' : 'add';
    await fetch(`/api/favorite/${currentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    setFavorite(!favorite);
  };

  const ignoreClip = async () => {
    if (!currentId) return;
    await fetch(`/api/ignore/${currentId}`, { method: 'POST' });
    loadRandom();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <video ref={videoRef} style={{ width: '80%' }} onEnded={handleEnded} controls />
      <div>
        <button onClick={loadRandom} style={{ fontSize: '2em', margin: 20 }}>Play Random</button>
        <button onClick={handleSkip} style={{ fontSize: '2em', margin: 20 }}>Skip</button>
        <button onClick={ignoreClip} style={{ margin: 20 }}>Ignore</button>
      </div>
      <div>
        <button onClick={() => vote('up')} disabled={voted}>👍</button>
        <button onClick={() => vote('down')} disabled={voted}>👎</button>
        <button onClick={toggleFavorite}>{favorite ? '★' : '☆'}</button>
      </div>
      <div style={{ marginTop: 20 }}>
        <Link href="/settings">Settings</Link>
        {' | '}
        <Link href="/manager">Video Manager</Link>
      </div>
    </div>
  );
}
