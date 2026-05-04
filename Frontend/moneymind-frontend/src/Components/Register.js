
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart3 } from "lucide-react";
import signinIllustration from "../signin.jpg";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from '../config/api';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 FIXED REGISTER FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(API_ENDPOINTS.REGISTER, {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (res.data.message === "Registration successful") {
        toast.success("Registration successful");

        // 👉 login page pe bhej
        navigate("/login");
      }

    } catch (error) {
      const message =
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      toast.error(message);
      console.error(error);
    }

    // reset form
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] flex items-center justify-center px-4">

      {/* MAIN CARD */}
      <div className="flex w-[85%] max-w-5xl min-h-[550px] bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={signinIllustration}
            alt="Signin"
            className="w-[100%] max-w-md object-contain"
          />
        </div>

        {/* RIGHT FORM */}
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
            Create Account 🚀
          </h2>

          <p className="text-gray-500 mb-6">
            Start managing your expenses smartly
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="username"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg shadow-md"
            >
              Sign Up
            </button>

          </form>

          {/* LOGIN LINK */}
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-purple-600 font-semibold cursor-pointer hover:underline"
              >
                Sign In
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;
