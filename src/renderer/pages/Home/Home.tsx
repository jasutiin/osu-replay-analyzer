import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import './Home.css';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileSelect = () => {
    // TODO: Add IPC call to open file dialog
    setSelectedFile('example-replay.osr');
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      navigate({ to: '/analyze' });
    }
  };

  return (
    <div className="home-container">
      <h1>osu! Replay Analyzer</h1>
      <p className="home-subtitle">Select a replay file to analyze</p>

      <div className="button-container">
        <button onClick={handleFileSelect} className="select-file-btn">
          Select Replay File
        </button>
      </div>

      {selectedFile && (
        <div className="file-info">
          <p className="file-name">
            Selected: <strong>{selectedFile}</strong>
          </p>
          <button onClick={handleAnalyze} className="analyze-btn">
            Analyze Replay
          </button>
        </div>
      )}
    </div>
  );
}
