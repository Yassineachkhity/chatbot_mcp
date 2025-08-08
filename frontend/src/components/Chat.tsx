import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SourceDoc {
  id: string;
  score: number;
  source: { title?: string; content?: string };
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<SourceDoc[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const resp = await axios.post('/api/chat/generate', {
        messages: newMessages,
        max_new_tokens: 200,
      });
      const reply = resp.data.reply as string;
      const assistantMsg: Message = { role: 'assistant', content: reply };
      setMessages([...newMessages, assistantMsg]);
      setSources(resp.data.sources || []);
    } catch (e: any) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Erreur / Error calling backend.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded p-4 h-96 overflow-y-auto bg-white shadow-sm">
        {messages.length === 0 && (
          <div className="text-gray-400 text-sm">Commencez à discuter / Start chatting...</div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className="mb-3">
            <div className={m.role === 'user' ? 'font-semibold text-indigo-600' : 'font-semibold text-green-600'}>
              {m.role === 'user' ? 'Vous / You' : 'Assistant'}
            </div>
            <div className="whitespace-pre-wrap text-sm">{m.content}</div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-500">Génération...</div>}
      </div>
      <div className="flex flex-col gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          rows={3}
          placeholder="Tapez votre message / Type your message"
          className="w-full border rounded p-2 text-sm focus:outline-none focus:ring focus:ring-indigo-300"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
          >
            Envoyer / Send
          </button>
        </div>
      </div>
      {sources.length > 0 && (
        <div className="mt-4 border rounded p-3 bg-gray-50 text-xs">
          <div className="font-semibold mb-2">Sources</div>
          <ul className="list-disc ml-4 space-y-1">
            {sources.map((s) => (
              <li key={s.id}>
                <span className="font-medium">{s.source.title || 'Sans titre'}</span>{' '}
                <span className="text-gray-500">(score: {s.score?.toFixed(2)})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Chat;
