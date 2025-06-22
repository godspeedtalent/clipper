import { useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const [currentId, setCurrentId] = useState(null);

  const loadRandom = async () => {
    const res = await fetch('/api/random');
    if (!res.ok) return;
    const clip = await res.json();
    setCurrentId(clip.id);
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

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <video ref={videoRef} style={{ width: '80%' }} onEnded={handleEnded} controls />
      <div>
        <button onClick={loadRandom} style={{ fontSize: '2em', margin: 20 }}>Play Random</button>
        <button onClick={handleSkip} style={{ fontSize: '2em', margin: 20 }}>Skip</button>
      </div>
    </div>
  );
}
