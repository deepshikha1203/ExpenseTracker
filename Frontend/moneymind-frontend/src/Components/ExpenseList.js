import React from "react";
import axios from "axios";
import CenterModal from "./CenterModal";
import { API_ENDPOINTS } from '../config/api';

function ExpenseList({ expenses = [], onDelete }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [deleteId, setDeleteId] = React.useState(null);
  const [notice, setNotice] = React.useState(null);

  const handleDelete = async () => {
    try {
      await axios.delete(
        API_ENDPOINTS.DELETE_EXPENSE(deleteId),
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setDeleteId(null);
      setNotice({
        title: "Expense deleted",
        message: "The transaction has been removed from your expense history.",
        variant: "success",
      });

      if (onDelete) onDelete();
    } catch (err) {
      console.error(err);
      setDeleteId(null);
      setNotice({
        title: "Delete failed",
        message: "We could not delete this expense. Please try again.",
        variant: "danger",
      });
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Transaction List</h3>

        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-2">S.No.</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Amount</th>
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              expenses.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{index + 1}</td>
                  <td className="py-2 px-2">{item.category}</td>
                  <td className="py-2 px-2">
                    Rs. {Number(item.amount).toFixed(2)}
                  </td>
                  <td className="py-2 px-2">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-2">
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CenterModal
        open={Boolean(deleteId)}
        title="Delete expense?"
        message="This transaction will be removed from your expense table, dashboard, reports, and charts."
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

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

export default ExpenseList;
