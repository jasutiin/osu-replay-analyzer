import { useState } from 'react';
import './Analyze.css';

export default function Analyze() {
  const [messages, setMessages] = useState<
    Array<{ id: number; text: string; sender: string }>
  >([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), text: input, sender: 'You' },
      ]);
      setInput('');
    }
  };

  return (
    <div className="analyze-container">
      {/* Video Section */}
      <div className="video-section">
        <h2>Replay Video</h2>
        <div className="video-player">Video Player Placeholder</div>
        <div className="replay-stats">
          <h3>Replay Stats</h3>
          <p>Player: Example Player</p>
          <p>Score: 1,234,567</p>
          <p>Accuracy: 98.5%</p>
          <p>Max Combo: 500x</p>
        </div>
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        <div className="chat-header">
          <h3>Chat</h3>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="message">
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-btn">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
