// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/login/`,
  REGISTER: `${API_BASE_URL}/api/register/`,

  // Expenses
  EXPENSES: `${API_BASE_URL}/api/expenses/`,
  DELETE_EXPENSE: (id) => `${API_BASE_URL}/api/delete-expense/${id}/`,

  // Dashboard
  DASHBOARD_SUMMARY: `${API_BASE_URL}/api/dashboard-summary/`,

  // Analytics
  ANALYTICS: `${API_BASE_URL}/api/analytics/`,

  // AI
  AI_ANALYSIS: `${API_BASE_URL}/api/ai-analysis/`,
};

export default API_BASE_URL;
