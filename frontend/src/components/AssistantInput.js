import React, { useState } from 'react';

export default function AssistantInput({ onSend, loading }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const onFileSelect = e => {
    setFile(e.target.files[0]);
  };

  const submit = e => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    onSend({ text: text.trim(), file });
    setText('');
    setFile(null);
    e.target.reset(); 
  };

  return (
    <form
      onSubmit={submit}
      className="bg-[#1e1e1e] border-t border-gray-700 px-6 py-4 flex flex-col sm:flex-row items-center gap-3"
    >
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Ask Emmanuel about budgeting, saving, investing..."
        className="flex-1 bg-transparent outline-none placeholder-gray-400 text-sm w-full"
        disabled={loading}
      />

      <label className="cursor-pointer text-sm bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50">
        {file ? file.name : 'Attach CSV'}
        <input
          type="file"
          accept=".csv"
          onChange={onFileSelect}
          className="hidden"
          disabled={loading}
        />
      </label>

      <button
        type="submit"
        className="text-sm px-5 py-2 rounded-md bg-cyan-500 hover:bg-cyan-400 transition disabled:opacity-50 text-white"
        disabled={loading}
      >
        {loading ? '…' : 'Send'}
      </button>
    </form>
  );
}
