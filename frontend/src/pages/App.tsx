import React, { useState } from 'react';
import Chat from '../components/Chat';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-indigo-600 text-white p-4 shadow">
        <h1 className="text-xl font-semibold">MCP Multilingual Chatbot</h1>
      </header>
      <main className="flex-1 p-4 max-w-3xl w-full mx-auto">
        <Chat />
      </main>
      <footer className="p-4 text-center text-xs text-gray-500">Prototype - Mistral + Elasticsearch + MCP pattern</footer>
    </div>
  );
};

export default App;
