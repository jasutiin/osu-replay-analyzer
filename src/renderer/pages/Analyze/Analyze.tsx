import { useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import './Analyze.css';

export default function Analyze() {
  const search = useSearch({ from: '/analyze' });
  const fileName = search.replayPath.split('\\').pop();
  const replayPath = search.replayPath as string | undefined;

  const [messages, setMessages] = useState<
    Array<{ id: number; text: string; sender: string }>
  >([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setInput('');
      setIsLoading(true);

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: userMessage, sender: 'You' },
      ]);

      try {
        const result = await (window as any).electronAPI.invokeAgent(
          userMessage
        );
        console.log('Full result:', result);
        const lastMessage = result.output[result.output.length - 1];
        let agentResponse = lastMessage?.content || 'No response content';

        // Handle structured response format
        const structuredPrefix = 'Returning structured response: ';
        if (agentResponse.startsWith(structuredPrefix)) {
          const jsonString = agentResponse.substring(structuredPrefix.length);
          try {
            const parsed = JSON.parse(jsonString);
            if (typeof parsed === 'object' && parsed.punny_response) {
              agentResponse = parsed.punny_response; // Extract the punny response
            } else {
              agentResponse = JSON.stringify(parsed, null, 2); // Fallback to pretty JSON
            }
          } catch {}
        } else {
          try {
            const parsed = JSON.parse(agentResponse);
            if (typeof parsed === 'object' && parsed.punny_response) {
              agentResponse = parsed.punny_response;
            } else if (typeof parsed === 'object') {
              agentResponse = JSON.stringify(parsed, null, 2);
            }
          } catch {
            // Plain text, use as is
          }
        }

        console.log('Final agent response:', agentResponse);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: agentResponse, sender: 'Agent' },
        ]);
      } catch (error) {
        console.error('Error invoking agent:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: 'Error: Could not get response from agent.',
            sender: 'Agent',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const printReplayData = () => {
    (window as any).electronAPI.printReplayData(replayPath);
  };

  return (
    <div className="analyze-container">
      {/* Video Section */}
      <div className="video-section">
        <h2>Replay Video</h2>
        <p>
          Analyzing:{' '}
          {fileName ? decodeURIComponent(fileName) : 'No file selected'}
        </p>
        <div className="video-player">Video Player Placeholder</div>
        <div className="replay-stats">
          <h3>Replay Stats</h3>
          <p>Player: Example Player</p>
          <p>Score: 1,234,567</p>
          <p>Accuracy: 98.5%</p>
          <p>Max Combo: 500x</p>
        </div>
      </div>

      <button onClick={printReplayData}>Print Data</button>

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
          {isLoading && <p className="loading">Agent is thinking...</p>}
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
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="send-btn"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
