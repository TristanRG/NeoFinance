import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

const ReportsExpenses = () => {
  const { user } = useContext(AuthContext);
  const [expenseYear, setExpenseYear] = useState(0);
  const [expenseMonth, setExpenseMonth] = useState(0);
  const [expenseWeek, setExpenseWeek] = useState(0);
  const [prevYear, setPrevYear] = useState(0);
  const [prevMonth, setPrevMonth] = useState(0);
  const [prevWeek, setPrevWeek] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyData2024, setMonthlyData2024] = useState([]);
  const [radarData, setRadarData] = useState([]);

  const expenseCategories = [
    "Food",
    "Transport",
    "Entertainment",
    "HealthCare",
    "Shopping",
    "Utilities",
  ];

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const res = await axios.get("/finance/transactions/");
        const transactions = res.data;
        const now = new Date();

        const currentYear = now.getFullYear();

        const startOfMonth = new Date(currentYear, now.getMonth(), 1);
        const startOfLastMonth = new Date(currentYear, now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(currentYear, now.getMonth(), 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        const endOfLastWeek = new Date(startOfWeek);
        endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);

        let yearTotal = 0,
          lastYearTotal = 0;
        let monthTotal = 0,
          lastMonthTotal = 0;
        let weekTotal = 0,
          lastWeekTotal = 0;

        const monthlySums = Array(12).fill(0);
        const monthlySums2024 = Array(12).fill(0);

        const categoryTotals = {};
        expenseCategories.forEach((cat) => {
          categoryTotals[cat] = 0;
        });

        transactions.forEach((t) => {
          const date = new Date(t.date);
          const amount = parseFloat(t.amount);
          if (t.type === "expense") {
            if (date.getFullYear() === currentYear) {
              yearTotal += amount;
              if (date >= startOfMonth) monthTotal += amount;
              if (date >= startOfWeek) weekTotal += amount;
              monthlySums[date.getMonth()] += amount;
            }

            if (date.getFullYear() === currentYear - 1) {
              lastYearTotal += amount;
              if (date >= startOfLastMonth && date <= endOfLastMonth)
                lastMonthTotal += amount;
              if (date >= startOfLastWeek && date <= endOfLastWeek)
                lastWeekTotal += amount;
              monthlySums2024[date.getMonth()] += amount;
            }

            if (expenseCategories.includes(t.category)) {
              categoryTotals[t.category] += amount;
            }
          }
        });

        const radarFormatted = expenseCategories.map((cat) => ({
          subject: cat,
          A: categoryTotals[cat],
        }));

        setRadarData(radarFormatted);
        setExpenseYear(yearTotal);
        setExpenseMonth(monthTotal);
        setExpenseWeek(weekTotal);
        setPrevYear(lastYearTotal);
        setPrevMonth(lastMonthTotal);
        setPrevWeek(lastWeekTotal);

        const monthLabels = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const formattedMonthlyData = monthLabels.map((label, index) => ({
          month: label,
          expense2025: monthlySums[index],
          expense2024: monthlySums2024[index],
        }));

        setMonthlyData(formattedMonthlyData);
      } catch (err) {
        console.error("Error fetching expense data:", err);
      }
    };

    fetchExpenseData();
  }, []);

  const formatCurrency = (amount) => `€${amount.toFixed(2)}`;
  const getChange = (current, previous) => {
    if (previous === 0) return { percent: 100, direction: "up" };
    const change = ((current - previous) / previous) * 100;
    return {
      percent: Math.abs(change).toFixed(1),
      direction: change >= 0 ? "up" : "down",
    };
  };

  const AnimatedArrow = ({ direction }) => {
    const color = direction === "up" ? "text-red-500" : "text-green-500";
    const Icon = direction === "up" ? ArrowUpRight : ArrowDownRight;
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`flex items-center gap-1 text-sm ${color}`}
      >
        <Icon size={16} />
      </motion.div>
    );
  };

  const yearChange = getChange(expenseYear, prevYear);
  const monthChange = getChange(expenseMonth, prevMonth);
  const weekChange = getChange(expenseWeek, prevWeek);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: "This Year", value: expenseYear, change: yearChange },
          { label: "This Month", value: expenseMonth, change: monthChange },
          { label: "This Week", value: expenseWeek, change: weekChange },
        ].map(({ label, value, change }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className={`p-6 rounded-xl shadow flex flex-col gap-2 ${
              idx === 1 ? "bg-red-50" : "bg-white"
            }`}
          >
            <h3 className="text-gray-500 text-sm">Total Expenses {label}</h3>
            <h2 className="text-2xl font-bold">{formatCurrency(value)}</h2>
            <div className="flex items-center gap-1">
              <AnimatedArrow direction={change.direction} />
              <span
                className={`${
                  change.direction === "up"
                    ? "text-red-500"
                    : "text-green-500"
                } text-sm`}
              >
                {change.direction === "up" ? "+" : "-"}
                {change.percent}% vs last {label.split(" ")[1].toLowerCase()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Spending</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`€${value.toFixed(2)}`, name]} />
              <Line
                type="monotone"
                dataKey="expense2025"
                stroke="#ff6b6b"
                strokeWidth={2}
                name="2025 Expenses"
              />
              <Line
                type="monotone"
                dataKey="expense2024"
                stroke="#ffa987"
                strokeWidth={2}
                name="2024 Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Expense Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 12 }} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, Math.max(...radarData.map((item) => item.A)) || 100]}
              />
              <Radar name="Expenses" dataKey="A" stroke="#b91c1c" fill="#f87171" fillOpacity={0.6} />
              <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value, name) => [`€${value.toFixed(2)}`, name]} />
            <Bar dataKey="expense2025" fill="#ff6b6b" name="2025 Expenses" />
            <Bar dataKey="expense2024" fill="#ffa987" name="2024 Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportsExpenses;
