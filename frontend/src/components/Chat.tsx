import React, { useState } from 'react';
import axios from 'axios';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ApiMessage {
  role: string;
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const payload = { messages: newMessages.map(m => ({ role: m.role, content: m.content })) };
      const resp = await axios.post('/api/chat/generate', payload);
      const reply = resp.data.reply || '(no response)';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error contacting server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded p-3 bg-white h-96 overflow-y-auto space-y-2">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={m.role === 'user' ? 'inline-block bg-indigo-500 text-white px-2 py-1 rounded' : 'inline-block bg-gray-200 px-2 py-1 rounded'}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">Generating...</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
            placeholder="Type a message..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button
          className="bg-indigo-600 text-white px-4 py-1 rounded disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >Send</button>
      </div>
    </div>
  );
};

export default Chat;
