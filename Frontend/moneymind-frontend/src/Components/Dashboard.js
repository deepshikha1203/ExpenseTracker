import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import welcomeImg from "../welcome.png";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../config/api';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    totalTransactions: 0,
    categoryExpenses: [],
    recentTransactions: [],
    monthlyChart: [],
  });
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = useMemo(() => (storedUser ? JSON.parse(storedUser) : null), [storedUser]);

  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .get(API_ENDPOINTS.DASHBOARD_SUMMARY, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setSummary(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [navigate, user]);

  const handleAskAI = async () => {
    if (!question || !user?.token) return;

    const userMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post(API_ENDPOINTS.AI_ANALYSIS, {
        question,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setMessages((prev) => [
        ...prev,
        { type: "ai", text: res.data.answer || "No response from AI" },
      ]);
      setQuestion("");
    } catch (err) {
      console.error("AI ERROR:", err);
      const backendMessage = err.response?.data?.answer || err.response?.data?.error;
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            backendMessage ||
            "AI is not responding. Please check the backend server and try again.",
        },
      ]);
    }
  };

  return (
    <Layout>
      <div className="flex gap-6">
        <div className="flex-1 p-10 space-y-6">
          <div className="flex justify-center">
            <img
              src={welcomeImg}
              alt="Welcome"
              className="w-full max-w-2xl object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard title="Total Expenses" value={summary.totalExpenses} />
            <SummaryCard title="This Month" value={summary.monthlyExpenses} />
            <SummaryCard
              title="Transactions"
              value={summary.totalTransactions}
              isCurrency={false}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow mb-6">
            <h2 className="text-2xl font-semibold mb-4">Expense Overview</h2>
            <div className="w-full h-[300px]">
              {loading ? (
                <p className="text-gray-500">Loading dashboard...</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary.monthlyChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `Rs. ${value}`} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#7c3aed"
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Category-wise Expenses</h2>
              {summary.categoryExpenses.length === 0 ? (
                <p className="text-gray-500">No category data yet.</p>
              ) : (
                summary.categoryExpenses.map((item) => (
                  <div
                    key={item.category}
                    className="flex justify-between border-b py-2 text-sm"
                  >
                    <span>{item.category}</span>
                    <span className="font-semibold">
                      Rs. {Number(item.total).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              {summary.recentTransactions.length === 0 ? (
                <p className="text-gray-500">No recent transactions.</p>
              ) : (
                summary.recentTransactions.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b py-2 text-sm"
                  >
                    <span>{item.category}</span>
                    <span>
                      Rs. {Number(item.amount).toFixed(2)} on{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="w-[350px] flex flex-col gap-4 sticky top-6 h-fit">
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow">
            <span className="text-sm font-medium">
              {user?.name || user?.email || "User"}
            </span>
            <div className="w-8 h-8 bg-purple-500 text-white flex items-center justify-center rounded-full">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-purple-700">Ask AI</h2>

            <div className="border rounded-xl p-4 h-[300px] overflow-y-auto bg-gray-50 text-base">
              {messages.length === 0 ? (
                <p className="text-gray-500">Ask anything about your expenses...</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[80%] p-3 rounded-xl mb-2 ${
                      msg.type === "user"
                        ? "bg-purple-600 text-white ml-auto"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask AI anything..."
                className="flex-1 px-4 py-3 text-base border rounded-xl focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleAskAI}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl text-base font-semibold"
              >
                Send
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {["total expense", "food expense", "shopping", "monthly report"].map(
                (q) => (
                  <button
                    key={q}
                    onClick={() => setQuestion(q)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-base py-3 rounded-xl font-medium hover:scale-105 transition"
                  >
                    {q}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SummaryCard({ title, value, isCurrency = true }) {
  return (
    <div className="bg-gradient-to-r from-green-400 to-cyan-400 rounded-2xl p-5 shadow-md h-[110px] flex flex-col justify-center">
      <h2 className="text-white text-lg font-semibold">{title}</h2>
      <h1 className="text-3xl font-bold text-black mt-2">
        {isCurrency ? `Rs. ${Number(value || 0).toFixed(2)}` : value}
      </h1>
    </div>
  );
}

export default Dashboard;
