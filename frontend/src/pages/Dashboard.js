import React, { useEffect, useState, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const COLORS = ["#f9a825", "#ffb74d", "#9575cd", "#4fc3f7"];

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

        let income = 0;
        let expense = 0;
        let lastMonthExp = 0;

        const transformed = transactionsRes.data.map((t) => {
          const dateObj = new Date(t.date);
          const month = dateObj.getMonth();
          const year = dateObj.getFullYear();

          if (month === currentMonth && year === currentYear) {
            if (t.type === "income") {
              income += parseFloat(t.amount);
            } else if (t.type === "expense") {
              expense += parseFloat(t.amount);
            }
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

        setMonthlyIncome(income);
        setMonthlyExpense(expense);
        setLastMonthExpense(lastMonthExp);

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

        setTransactions(transformed);
        setUserInfo(userRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    <div className="min-h-screen" style={{ backgroundColor: "#e4e6e7" }}>
      <div className="p-8 mt-6">
        <h1 className="text-2xl font-semibold mb-8 mt-6">
          Good Day, {userInfo ? userInfo.username : "User"}
        </h1>

        <div className="bg-white rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 mt-4">
          {/* Virtual Card */}
          <div className="p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Virtual Card</h2>
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl text-white p-6 space-y-2">
              <div className="text-sm">
                Your current balance: €
                {userInfo ? parseFloat(userInfo.balance).toFixed(2) : "0.00"}
              </div>
              <div className="text-right text-sm">
                Member since:{" "}
                {userInfo ? formatDate(userInfo.created_at) : "N/A"}
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
            <div className="bg-gray-100 p-4 rounded-xl text-center text-sm">
              <p className="mb-2">Get Additional 15% Cashback</p>
              <button className="bg-blue-100 text-blue-500 text-xs px-3 py-1 rounded-full">
                6.4M Claimed
              </button>
              <p className="mt-2 text-xs">Expiry Date: May 25, 2025</p>
            </div>
          </div>

          {/* Transactions Preview */}
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
                transactions.slice(0, 3).map((t, i) => (
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

          {/* Pie Chart */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Spending Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={[
                    { name: "Shopping", value: 13 },
                    { name: "Food", value: 27 },
                    { name: "Entertainment", value: 30 },
                    { name: "Transport", value: 30 },
                  ]}
                  outerRadius={80}
                  label
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
