import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from '../config/api';

function AIAnalysis() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleAsk = () => {
    if (!query || !user?.token) return;

    const newMessages = [...messages, { type: "user", text: query }];
    setMessages(newMessages);
   
setLoading(true);
    axios.post(API_ENDPOINTS.AI_ANALYSIS, {
      query,
    }, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => {
    setMessages([...newMessages, { type: "ai", text: res.data.answer }]);
  })
  .catch(err => console.log(err))
  .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow flex flex-col h-[400px]">
      <h2 className="text-xl font-semibold mb-3">🤖 Ask AI</h2>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg text-sm max-w-[80%] ${
              msg.type === "user"
                ? "bg-purple-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>


      {/* INPUT */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Ask AI anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleAsk}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>

      {/* RESPONSE */}
      {response && (
        <div className="bg-gray-100 p-3 rounded-lg text-sm">
          {response}
        </div>
      )}
    </div>
  );
}

export default AIAnalysis;
