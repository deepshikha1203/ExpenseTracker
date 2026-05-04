import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import firstImg from "../first.jpg";
import reportsImg from "../reports.jpg";
import insightsImg from "../insights.jpg";
import AnalyticsImg from "../Analytics.jpg"

function FeatureSection({ title, description, image, reverse }) {
  return (
    <div className={`flex flex-col md:flex-row items-center gap-16 py-20 ${
  reverse ? "md:flex-row-reverse bg-white" : "bg-[#FAF7F2]"
}`}>
      {/* IMAGE */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={image}
          alt={title}
          className="w-[80%] max-w-md rounded-xl  hover:scale-105 transition duration-300 bg-transparent mix-blend-multiply"
        />
      </div>

      {/* TEXT */}
      <div className="w-full md:w-1/2 text-center md:text-left px-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-600 text-lg-bold
       md:text-xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* 🔵 NAVBAR */}
      <div className="flex justify-between items-center px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <BarChart3 className="text-white" />
          <h1 className="text-3xl font-bold">
            Money<span className="text-white">Mind</span> AI
          </h1>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-700"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-700"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* 🔥 HERO SECTION */}
      <div className="py-20 px-10 bg-[#FAF7F2]">

  <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">

    {/* LEFT TEXT */}
    <div className="md:w-1/2 text-center md:text-left">

      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Manage Your Expenses Smartly 💸
      </h1>

      <p className="text-3xl md:text-xl mb-6">
        Track your daily spending, analyze patterns, and get AI-powered insights to save more.
      </p>

    </div>

    {/* RIGHT IMAGE */}
    <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
      <img
        src={firstImg}
        alt="Expense Tracking"
        className="w-[80%] max-w-md rounded-xl hover:scale-105 transition duration-300 bg-transparent mix-blend-multiply"
      />
    </div>

  </div>

</div>

      {/* 📊 FEATURES SECTION */}
      <div className="py-20 px-10 bg-white text-center">
<h1 className="text-3xl font-bold mb-4">
  Why MoneyMind AI ?
</h1>
        <p className="max-w-4xl mx-auto text-gray-700 text-xl md:text-2xl leading-relaxed text-center whitespace-pre-line">

          In today’s fast-paced digital world, many individuals struggle
           with overspending, poor budgeting, and lack of financial planning. 
           Traditional methods of tracking expenses are often manual, time-consuming, 
           and fail to provide meaningful insights.

          MoneyMind AI goes beyond basic expense tracking. It not only
           records your daily expenses but also analyzes your financial 
           behavior using data-driven insights and AI-powered recommendations.
           </p>
           
      </div>
      {/*Images*/}
      <div className="px-10 bg-[#FAF7F2] py-10">

        <FeatureSection
          title="📊 Smart Analytics"
          description="Visualize your expenses with interactive charts and understand your spending patterns easily."
         image={AnalyticsImg}
        />

        <FeatureSection
          title="🤖 AI Insights"
          description="Get intelligent suggestions based on your spending patterns. 
Analyze trends, identify unnecessary expenses, and receive smart recommendations to improve your financial habits."
          image={insightsImg}
          reverse
        />

        <FeatureSection
          title="📅 Daily Tracking"
          description="Easily record and monitor your daily expenses in real-time. 
          Stay organized, maintain consistency, and keep full control of your financial activities."
          image={reportsImg}
        />

      </div>

      {/* 🚀 FINAL CTA */}
<div className="flex justify-center mt-10">
  <div className="flex items-center gap-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg">

    <span className="text-lg md:text-xl font-medium">
      Ready to take control of your finances?
    </span>

    <button
      onClick={() => navigate("/register")}
      className="bg-white text-purple-600 px-5 py-2 rounded-full hover:bg-gray-100 transition"
    >
      Get Started
    </button>

  </div>
</div>

    </div>
  );
}

export default HomePage;