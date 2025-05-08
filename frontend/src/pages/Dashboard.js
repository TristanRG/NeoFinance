import React, { useEffect, useState, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Carousel from "../components/Carousel";

const COLORS = ["#f9a825", "#ffb74d", "#9575cd", "#4fc3f7", "#f06292", "#4db6ac"];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [lastMonthExpense, setLastMonthExpense] = useState(0);
  const [expenseComparisonText, setExpenseComparisonText] = useState("");
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, userRes] = await Promise.all([
          axios.get("/finance/transactions/"),
          axios.get("/users/me/"),
        ]);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        let totalExp = 0;
        let income = 0;
        let expense = 0;
        let lastMonthExp = 0;
        const monthMap = {};
        const categoryMap = {};

        const transformed = transactionsRes.data.map((t) => {
          const dateObj = new Date(t.date);
          const month = dateObj.getMonth();
          const year = dateObj.getFullYear();

          const label = `${dateObj.toLocaleString("default", {
            month: "short",
          })} ${year}`;

          if (t.type === "expense") {
            totalExp += parseFloat(t.amount); 
          }

          if (!monthMap[label]) monthMap[label] = 0;
          if (t.type === "expense") {
            monthMap[label] += parseFloat(t.amount);

            const cat = t.category || "Uncategorized";
            categoryMap[cat] = (categoryMap[cat] || 0) + parseFloat(t.amount);
          }

          if (month === currentMonth && year === currentYear) {
            if (t.type === "income") income += parseFloat(t.amount);
            if (t.type === "expense") expense += parseFloat(t.amount);
          }

          if (month === lastMonth && year === lastMonthYear && t.type === "expense") {
            lastMonthExp += parseFloat(t.amount);
          }

          return {
            ...t,
            date: dateObj.toLocaleDateString(),
            time: dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });

        const trendsData = Object.entries(monthMap).map(([month, total]) => ({
          month,
          expense: parseFloat(total.toFixed(2)),
        }));
        trendsData.sort((a, b) => new Date(`01 ${a.month}`) - new Date(`01 ${b.month}`));

        const pieChartData = Object.entries(categoryMap).map(([category, value]) => ({
          name: category,
          value: parseFloat(value.toFixed(2)),
        }));
        pieChartData.sort((a, b) => b.value - a.value);

        setMonthlyTrends(trendsData);
        setPieData(pieChartData);
        setMonthlyIncome(income);
        setMonthlyExpense(expense);
        setLastMonthExpense(lastMonthExp);
        setTransactions(transformed);
        setUserInfo(userRes.data);
        setTotalExpense(totalExp);

        if (lastMonthExp === 0 && expense > 0) {
          setExpenseComparisonText("No expenses last month");
        } else if (expense === 0 && lastMonthExp > 0) {
          setExpenseComparisonText("No expenses this month");
        } else if (lastMonthExp === 0 && expense === 0) {
          setExpenseComparisonText("No expenses recorded yet");
        } else {
          const diff = ((expense - lastMonthExp) / lastMonthExp) * 100;
          const roundedDiff = Math.abs(diff).toFixed(1);
          const direction = diff >= 0 ? "more" : "less";
          setExpenseComparisonText(`${roundedDiff}% ${direction} than last month`);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="p-8 pt-6">
        <h1 className="text-2xl font-semibold mb-8 mt-6">
          Good Day, {userInfo ? userInfo.username : "User"}
        </h1>

        <div className="bg-white rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 mt-4">
          {/* Virtual Card */}
          <div className="p-6 flex flex-col gap-4 min-h-[640px]">
            <h2 className="text-xl font-semibold">Virtual Card</h2>
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl text-white p-6 space-y-2">
              <div className="text-sm">
                Your current balance: €{userInfo ? parseFloat(userInfo.balance).toFixed(2) : "0.00"}
              </div>
              <div className="text-right text-sm">
                Member since: {userInfo ? formatDate(userInfo.created_at) : "N/A"}
              </div>
              <div className="tracking-widest text-xl">
                •••• •••• •••• {userInfo ? userInfo.id.slice(-4) : "0000"}
              </div>
              <div className="flex justify-between text-sm">
                <span>Your income this month: €{monthlyIncome.toFixed(2)}</span>
                <span>{expenseComparisonText}</span>
              </div>
              <div className="text-sm">
                Your spendings this month: €{monthlyExpense.toFixed(2)}
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                      onClick={() => navigate('/transactions')}
              >
                Add more funds
              </button>
              <button className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
                      onClick={() => navigate('/assistant')}
              >
                Talk about your spendings
              </button>
            </div>
            <div className="mt-4 h-[200px]">
              <Carousel className="max-h-[270px] w-full object-contain" />
            </div>
            </div>

          {/* Transactions */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Transactions</h2>
              <div className="text-right">
                <p
                  className="text-blue-500 text-sm font-medium cursor-pointer hover:underline mb-1"
                  onClick={() => navigate("/transactions")}
                >
                  See all &gt;
                </p>
                <input
                  type="month"
                  className="border p-2 rounded-md text-sm"
                  defaultValue="2025-04"
                />
              </div>
            </div>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-gray-500">Loading transactions...</p>
              ) : transactions.length === 0 ? (
                <p className="text-sm text-gray-500">No transactions yet.</p>
              ) : (
                transactions.slice(0, 6).map((t, i) => (
                  <div key={i} className="flex justify-between border-b pb-2">
                    <div>
                      <div className="text-sm text-gray-500">
                        {t.date} {t.time}
                      </div>
                      <div className="text-base font-medium">
                        Transaction category: {t.category}
                      </div>
                      <div className="text-sm text-gray-500">
                        Transaction ID: {t.id}
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        t.type === "expense"
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      €{parseFloat(t.amount).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Charts */}
          <div className="p-6 flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Spending Breakdown</h2>

           <div className="relative w-full h-[260px]">
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        innerRadius={60}
        outerRadius={100}
        paddingAngle={3}
        cornerRadius={8}
        labelLine={false}
        label={({ name, percent }) =>
          `${name} ${(percent * 100).toFixed(0)}%`
        }
      >
        {pieData.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>

  {/* Centered total inside the donut chart */}
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
    <p className="text-xs text-gray-500">Total</p>
    <p className="text-xl font-bold text-gray-800">
      €{totalExpense.toFixed(2)}
    </p>
  </div>
</div>

<div className="mt-6 col-span-2 h-[300px] bg-white rounded-2xl shadow-md p-6">
  <h2 className="text-lg font-semibold mb-4">Monthly Spending</h2>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={monthlyTrends}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
      <YAxis tickFormatter={(value) => `€${value}`} />
      <Tooltip formatter={(value) => `€${value}`} />
      <Bar dataKey="expense" fill="#2ecfe3" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

      </div>
    </div>
  </div>
</div>
  );
};

export default DashboardPage;
