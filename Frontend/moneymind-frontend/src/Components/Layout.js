/*import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaMoneyBill, FaChartBar, FaChartPie, FaSignOutAlt } from "react-icons/fa";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  const menuItem = (path, icon, label) => (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center gap-4 text-lg p-3 rounded-xl cursor-pointer transition-all duration-200
      ${
        location.pathname === path
          ? "bg-white text-purple-700 font-semibold border-l-4 border-purple-600 pl-2"
          : "hover:bg-white/20"
      }`}
    >
      {icon} {label}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#eef2f7]">

      {/* SIDEBAR *//*
      <div className="w-64 bg-gradient-to-b from-purple-600 to-purple-800 text-white flex flex-col justify-between p-5">

        <div>
          <h1 className="text-3xl font-bold mb-12">MoneyMind AI</h1>

          
  {/* NAV *//*
  <nav className="space-y-5 flex-1">

    <div onClick={() => navigate("/dashboard")}
  className={`flex items-center gap-5 text-xl p-3 rounded-xl cursor-pointer transition 
  ${location.pathname === "/dashboard" ? "bg-white text-purple-700 font-semibold shadow" : "hover:bg-white/20"}`}>
  <FaHome size={24} /> Dashboard
</div>

<div onClick={() => navigate("/expenses")}
  className={`flex items-center gap-5 text-xl p-3 rounded-xl cursor-pointer transition 
  ${location.pathname === "/expenses" ? "bg-white text-purple-700 font-semibold shadow" : "hover:bg-white/20"}`}>
  <FaMoneyBill size={24} /> Expenses
</div>

<div onClick={() => navigate("/reports")}
  className={`flex items-center gap-5 text-xl p-3 rounded-xl cursor-pointer transition 
  ${location.pathname === "/reports" ? "bg-white text-purple-700 font-semibold shadow" : "hover:bg-white/20"}`}>
  <FaChartBar size={24} /> Reports
</div>

<div onClick={() => navigate("/charts")}
  className={`flex items-center gap-5 text-xl p-3 rounded-xl cursor-pointer transition 
  ${location.pathname === "/charts" ? "bg-white text-purple-700 font-semibold shadow" : "hover:bg-white/20"}`}>
  <FaChartPie size={24} /> Charts
</div>

  </nav>

        </div>

        {/* LOGOUT *//*
        <div
          onClick={() => navigate("/login")}
          className="flex items-center gap-4 text-lg cursor-pointer hover:opacity-80"
          ><FaSignOutAlt size={26} /> Logout
        </div>

      </div>

      {/* MAIN CONTENT *//*
      <div className="flex-1 p-6">
        {children}
      </div>

    </div>
  );
}

export default Layout;

*/
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaMoneyBill,
  FaChartBar,
  FaChartPie,
  FaSignOutAlt
} from "react-icons/fa";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#eef2f7]">

      {/* SIDEBAR */}
      <div className="w-64 min-h-screen fixed left-0 top-0
                      bg-gradient-to-b from-purple-600 to-purple-800
                      text-white flex flex-col justify-between p-5 shadow-lg">

        {/* TOP SECTION */}
        <div>
          <h1 className="text-3xl font-bold mb-12">
            MoneyMind AI
          </h1>

          {/* NAVIGATION */}
          <nav className="space-y-5">

            {/* Dashboard */}
            <div
              onClick={() => navigate("/dashboard")}
              className={`flex items-center gap-5 text-xl p-3 rounded-xl cursor-pointer transition
              ${
                location.pathname === "/dashboard"
                  ? "bg-white text-purple-700 font-semibold shadow"
                  : "hover:bg-white/20"
              }`}
            >
              <FaHome size={24} />
              Dashboard
            </div>

            {/* Expenses */}
            <div
              onClick={() => navigate("/expenses")}
              className={`flex items-center gap-5 text-xl p-3 rounded-xl cursor-pointer transition
              ${
                location.pathname === "/expenses"
                  ? "bg-white text-purple-700 font-semibold shadow"
                  : "hover:bg-white/20"
              }`}
            >
              <FaMoneyBill size={24} />
              Expenses
            </div>

            {/* Reports */}
            <div
              onClick={() => navigate("/reports")}
              className={`flex items-center gap-5 text-xl p-3 rounded-xl cursor-pointer transition
              ${
                location.pathname === "/reports"
                  ? "bg-white text-purple-700 font-semibold shadow"
                  : "hover:bg-white/20"
              }`}
            >
              <FaChartBar size={24} />
              Reports
            </div>

            {/* Charts */}
            <div
              onClick={() => navigate("/charts")}
              className={`flex items-center gap-5 text-xl p-3 rounded-xl cursor-pointer transition
              ${
                location.pathname === "/charts"
                  ? "bg-white text-purple-700 font-semibold shadow"
                  : "hover:bg-white/20"
              }`}
            >
              <FaChartPie size={24} />
              Charts
            </div>

          </nav>
        </div>

        {/* LOGOUT FIXED AT BOTTOM */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-4 text-lg cursor-pointer
                     hover:bg-white/20 p-3 rounded-xl transition"
        >
          <FaSignOutAlt size={24} />
          Logout
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 p-6">
        {children}
      </div>

    </div>
  );
}

export default Layout;
