import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CenterModal from "./CenterModal";
import { API_ENDPOINTS } from '../config/api';

function Report() {
  const [date, setDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [notice, setNotice] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const categories = ["Food", "Travel", "Shopping", "Bills", "stationary"];

  const expensesByDate = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      const key = new Date(expense.date).toDateString();
      acc[key] = [...(acc[key] || []), expense];
      return acc;
    }, {});
  }, [expenses]);

  const fetchExpenses = useCallback(async () => {
    if (!user?.token) return;

    try {
      const res = await axios.get(
        API_ENDPOINTS.EXPENSES,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setExpenses(res.data);
    } catch (err) {
      console.error("Error loading report expenses:", err);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async () => {
    if (!form.category || !form.amount || !user?.token) {
      setNotice({
        title: "Missing details",
        message: "Please enter a category and amount before saving this expense.",
        variant: "info",
      });
      return;
    }

    try {
      await axios.post(API_ENDPOINTS.EXPENSES, {
        category: form.category,
        amount: parseFloat(form.amount),
        description: "",
        date: toInputDate(date),
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setForm({ category: "", amount: "" });
      setShowPopup(false);
      setNotice({
        title: "Expense added",
        message: "This dated expense is now visible in history, charts, and dashboard totals.",
        variant: "success",
      });
      fetchExpenses();
    } catch (err) {
      console.error("Error adding report expense:", err.response?.data || err);
      setNotice({
        title: "Add expense failed",
        message: "We could not save this expense. Please try again.",
        variant: "danger",
      });
    }
  };

  return (
    <Layout>
      <div className="flex-1 items-center mb-6 w-full">
        <h1 className="text-3xl font-bold text-gray-800">My Calendar</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, prev.getDate()))}
            className="px-3 py-1 bg-gray-200 rounded-lg"
          >
            Prev
          </button>

          <span className="text-xl font-semibold">
            {date.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>

          <button
            onClick={() => setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, prev.getDate()))}
            className="px-3 py-1 bg-gray-200 rounded-lg"
          >
            Next
          </button>

          <button
            onClick={() => setDate(new Date())}
            className="px-3 py-1 bg-purple-500 text-white rounded-lg"
          >
            Today
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md w-full mt-2">
        <Calendar
          onChange={(value) => {
            setDate(value);
            setShowPopup(true);
          }}
          value={date}
          className="rounded-xl border-none w-full"
          tileClassName={({ date }) => {
            const key = date.toDateString();
            return expensesByDate[key] ? "highlight-date" : null;
          }}
          tileContent={({ date }) => {
            const key = date.toDateString();
            const dayExpenses = expensesByDate[key];

            if (!dayExpenses) return null;

            return (
              <div className="text-xs mt-1 flex flex-wrap justify-center gap-1">
                {dayExpenses.slice(0, 2).map((item) => (
                  <span
                    key={item.id}
                    className="bg-purple-500 text-white px-2 py-[2px] rounded-full"
                  >
                    {item.category}
                  </span>
                ))}
              </div>
            );
          }}
        />
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-[450px]">
            <h2 className="text-2xl font-bold mb-2">Add Expense</h2>
            <p className="text-gray-500 mb-6 text-lg">{date.toDateString()}</p>

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-4 border rounded-xl mb-4 text-lg"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full p-4 border rounded-xl mb-4 text-lg"
            />

            <div className="flex gap-3">
              <button
                onClick={handleAddExpense}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg"
              >
                Add
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <CenterModal
        open={Boolean(notice)}
        title={notice?.title}
        message={notice?.message}
        variant={notice?.variant}
        onConfirm={() => setNotice(null)}
      />
    </Layout>
  );
}

function toInputDate(value) {
  const offsetDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().split("T")[0];
}

export default Report;
