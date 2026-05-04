
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";
import { API_ENDPOINTS } from '../config/api';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
  const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(
      API_ENDPOINTS.EXPENSES,
      { headers: { Authorization: `Bearer ${user?.token}` } }
    );

    setExpenses(res.data);

    } catch (err) {
      console.error("ERROR FETCHING:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load on page start
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <Layout>
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Expenses</h1>

        {/* FORM */}
        <div className="mb-6">
          <ExpenseForm onAdd={fetchExpenses} />
        </div>

        {/* LIST */}
        <div className="bg-white p-6 rounded-2xl shadow">
          {loading ? (
            <p className="text-gray-500">Loading expenses...</p>
          ) : (
            <ExpenseList expenses={expenses} onDelete={fetchExpenses} />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Expenses;
