import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import './Watch.css';

export default function Watch() {
  const [replays, setReplays] = useState<string[]>([]);
  const [osuPath, setOsuPath] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const initWatching = async () => {
      const path = await (window as any).electronAPI.getOsuPath();
      setOsuPath(path);
      await (window as any).electronAPI.startWatching(path);
    };
    initWatching();

    // watch for new replays
    (window as any).electronAPI.onNewReplay((filePath: string) => {
      setReplays(prev => [...prev, filePath]);
    });

    // stop watching for new replays when leaving the page
    return () => {
      (window as any).electronAPI.stopWatching();
    };
  }, []);

  const handleAnalyze = (replayPath: string) => {
    const fileName = replayPath.split('\\').pop();
    navigate({ to: '/analyze?file=' + encodeURIComponent(fileName) });
  };

  return (
    <div className="watch-container">
      <h1>Watch for New Replays</h1>
      <h2>New Replays Detected:</h2>
      <ul>
        {replays.map((replay, index) => (
          <li key={index}>
            {replay.split('\\').pop()}
            <button className="analyze-btn" onClick={() => handleAnalyze(replay)}>Analyze</button>
          </li>
        ))}
      </ul>
    </div>
  );
};