
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart3 } from 'lucide-react';
import LoginIllustration from '../Login.png';
import toast from "react-hot-toast";
import { API_ENDPOINTS } from '../config/api';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      // ✅ correct validation
      if (!formData.email || !formData.password) {
        toast.error("Please fill all fields");
        return;
      }

    try {
      const res = await axios.post(API_ENDPOINTS.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      // ✅ success check
      if (res.data.message === "Login successful") {
        localStorage.setItem(
  "user",
  JSON.stringify({
    email: res.data.email,
     name: res.data.name,
     token: res.data.token,
  })
);

        toast.success("Login successful");
        navigate('/dashboard');
      }

    } catch (error) {
      toast.error("Invalid email or password");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] flex items-center justify-center px-4">

      <div className="flex w-[85%] max-w-5xl min-h-[550px] bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={LoginIllustration}
            alt="Illustration"
            className="w-[100%] max-w-md object-contain"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 p-10 flex flex-col justify-center">

          {/* LOGO */}
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-xl font-bold">
              Money<span className="text-purple-600">Mind</span> AI
            </h1>
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-bold mb-2">
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 mb-6">
            Login to manage your expenses
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg shadow-md"
            >
              Sign In
            </button>

            {/* REGISTER LINK */}
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-purple-600 font-semibold cursor-pointer hover:underline"
                >
                  Create one
                </span>
              </p>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;
