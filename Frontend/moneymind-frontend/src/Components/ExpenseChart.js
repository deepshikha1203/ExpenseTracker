import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Layout from "./Layout";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <p className="text-gray-500">No data for chart</p>;
  }
  
  const categoryData = {};

  (expenses || []).forEach((item) => {
    if (categoryData[item.category]) {
      categoryData[item.category] += item.amount;
    } else {
      categoryData[item.category] = item.amount;
    }
  });

  const data = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(categoryData),
        backgroundColor: [
          "#8b5cf6",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#3b82f6",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
}

export default ExpenseChart;