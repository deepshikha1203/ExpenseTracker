
import React, { useState } from "react";
import axios from "axios";
import CenterModal from "./CenterModal";
import { API_ENDPOINTS } from '../config/api';

function ExpenseForm({ onAdd }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [categories, setCategories] = useState([
    "Food",
    "Travel",
    "Shopping",
    "Bills",
  ]);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [showInput, setShowInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [notice, setNotice] = useState(null);

  // CATEGORY CHANGE
  const handleCategoryChange = (value) => {
    if (value === "new") {
      setShowInput(true);
    } else {
      setCategory(value);
    }
  };

  // ADD NEW CATEGORY
  const handleAddNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
    setCategory(newCategory);
    setNewCategory("");
    setShowInput(false);
  };

  // 🔥 FINAL FIXED SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalCategory = category;

    if (!finalCategory && newCategory) {
      finalCategory = newCategory;
    }

    if (!finalCategory || !amount || !date) {
      setNotice({
        title: "Missing details",
        message: "Please select a category, enter an amount, and choose a date.",
        variant: "info",
      });
      return;
    }

    if (!user?.token) {
      setNotice({
        title: "Login required",
        message: "Please login again before adding an expense.",
        variant: "danger",
      });
      return;
    }

    try {
      const newExpense = {
  category: finalCategory,
  amount: parseFloat(amount),
  date: date,
  description: ""
};
      console.log("SENDING:", newExpense);

      const res = await axios.post(
        API_ENDPOINTS.EXPENSES,
        newExpense,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      console.log("RESPONSE:", res.data);

      // ✅ REFRESH LIST (VERY IMPORTANT)
      if (onAdd) {
        onAdd();
      }

      // RESET
      setCategory("");
      setAmount("");
      setDate("");
      setNewCategory("");
      setShowInput(false);
      setNotice({
        title: "Expense added",
        message: "Your new transaction is now synced with dashboard, reports, and charts.",
        variant: "success",
      });

    } catch (err) {
      console.error("ERROR:", err.response?.data || err);
      setNotice({
        title: "Add expense failed",
        message: "We could not save this expense. Please check the details and try again.",
        variant: "danger",
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Add Expense</h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-3 border rounded-lg"
        >
          <option value="">Select Category</option>

          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}

          <option value="new">+ Add New</option>
        </select>

        {/* NEW CATEGORY */}
        {showInput && (
          <div className="flex gap-2 col-span-3">
            <input
              type="text"
              placeholder="Enter new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-4 py-3 border rounded-lg w-full"
            />

            <button
              type="button"
              onClick={handleAddNewCategory}
              className="bg-blue-500 text-white px-4 rounded-lg"
            >
              Add
            </button>

            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="bg-gray-400 text-white px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-4 py-3 border rounded-lg"
        />

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-3 border rounded-lg"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="bg-green-500 text-white font-bold px-6 py-3 rounded-lg col-span-3"
        >
          Submit
        </button>
        </form>
      </div>

      <CenterModal
        open={Boolean(notice)}
        title={notice?.title}
        message={notice?.message}
        variant={notice?.variant}
        onConfirm={() => setNotice(null)}
      />
    </>
  );
}

export default ExpenseForm;
