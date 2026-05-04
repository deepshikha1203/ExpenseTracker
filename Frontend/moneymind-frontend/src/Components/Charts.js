import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import { API_ENDPOINTS } from '../config/api';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Charts() {
  const [analytics, setAnalytics] = useState({
    monthly: [],
    monthlyByCategory: [],
    weekly: [],
    yearly: [],
    categories: [],
  });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.token) return;

    axios
      .get(API_ENDPOINTS.ANALYTICS, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setAnalytics(res.data))
      .catch((err) => console.log(err));
  }, [user?.token]);

  const dayLabels = Array.from({ length: 31 }, (_, i) => i + 1);
  const monthlyMap = analytics.monthly.reduce((acc, item) => {
    acc[item.day] = Number(item.total);
    return acc;
  }, {});

  const categoryLabels = analytics.categories.map((item) => item.category);
  const categoryValues = analytics.categories.map((item) => Number(item.total));
  const categoryPalette = ["#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];
  const colorByCategory = categoryLabels.reduce((acc, category, index) => {
    acc[category] = categoryPalette[index % categoryPalette.length];
    return acc;
  }, {});
  const topCategoryByDay = analytics.monthlyByCategory.reduce((acc, item) => {
    if (!acc[item.day] || Number(item.total) > Number(acc[item.day].total)) {
      acc[item.day] = item;
    }
    return acc;
  }, {});

  const monthlyData = {
    labels: dayLabels,
    datasets: [
      {
        label: "Daily Expenses Rs.",
        data: dayLabels.map((day) => monthlyMap[day] || 0),
        backgroundColor: dayLabels.map((day) => {
          const category = topCategoryByDay[day]?.category;
          return colorByCategory[category] || "#8b5cf6";
        }),
        borderRadius: 6,
        maxBarThickness: 28,
      },
    ],
  };

  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Category Expenses",
        data: categoryValues,
        backgroundColor: categoryLabels.map((category) => colorByCategory[category]),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Monthly Expense Analysis" },
      tooltip: {
        callbacks: {
          label: (context) => `Rs. ${context.raw}`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
    maintainAspectRatio: false,
  };

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 18,
          padding: 12,
        },
      },
    },
  };

  return (
    <Layout>
      <div className="p-10">
        <h1 className="text-4xl font-bold mb-6">Charts</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Monthly Expense Analysis</h2>
            <div className="h-[400px]">
              <Bar data={monthlyData} options={options} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
            {categoryValues.length === 0 ? (
              <p className="text-gray-500">No category data yet.</p>
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                <Doughnut data={categoryData} options={categoryOptions} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Charts;
