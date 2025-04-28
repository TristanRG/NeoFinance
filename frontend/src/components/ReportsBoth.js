import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
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

const ReportsBoth = () => {
  const { user } = useContext(AuthContext);
  const [incomeYear, setIncomeYear] = useState(0);
  const [expenseYear, setExpenseYear] = useState(0);
  const [incomeMonth, setIncomeMonth] = useState(0);
  const [expenseMonth, setExpenseMonth] = useState(0);
  const [incomeWeek, setIncomeWeek] = useState(0);
  const [expenseWeek, setExpenseWeek] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [radarData, setRadarData] = useState([]);

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investments",
    "Consulting",
    "Online Sales",
    "Gifts",
  ];

  useEffect(() => {
    const fetchData = async () => {
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

        let incomeY = 0, expenseY = 0, incomeM = 0, expenseM = 0, incomeW = 0, expenseW = 0;
        const incomeMonthly = Array(12).fill(0);
        const expenseMonthly = Array(12).fill(0);

        const categoryTotals = {};
        incomeCategories.forEach((cat) => (categoryTotals[cat] = 0));

        transactions.forEach((t) => {
          const date = new Date(t.date);
          const amount = parseFloat(t.amount);
          const monthIndex = date.getMonth();

          if (date.getFullYear() === currentYear) {
            if (t.type === "income") {
              incomeY += amount;
              if (date >= startOfMonth) incomeM += amount;
              if (date >= startOfWeek) incomeW += amount;
              incomeMonthly[monthIndex] += amount;

              if (incomeCategories.includes(t.category)) {
                categoryTotals[t.category] += amount;
              }
            } else if (t.type === "expense") {
              expenseY += amount;
              if (date >= startOfMonth) expenseM += amount;
              if (date >= startOfWeek) expenseW += amount;
              expenseMonthly[monthIndex] += amount;
            }
          }

          if (date.getFullYear() === currentYear - 1 && t.type === "income") {
            if (date >= startOfLastMonth && date <= endOfLastMonth)
              incomeM += amount;
            if (date >= startOfLastWeek && date <= endOfLastWeek)
              incomeW += amount;
          }
        });

        const radarFormatted = incomeCategories.map((cat) => ({
          subject: cat,
          A: categoryTotals[cat],
        }));

        const monthLabels = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        const formattedMonthly = monthLabels.map((month, index) => ({
          month,
          income: incomeMonthly[index],
          expense: expenseMonthly[index],
        }));

        setRadarData(radarFormatted);
        setMonthlyData(formattedMonthly);
        setIncomeYear(incomeY);
        setExpenseYear(expenseY);
        setIncomeMonth(incomeM);
        setExpenseMonth(expenseM);
        setIncomeWeek(incomeW);
        setExpenseWeek(expenseW);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
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
    const color = direction === "up" ? "text-green-500" : "text-red-500";
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

  const yearChangeIncome = getChange(incomeYear, expenseYear);
  const monthChangeIncome = getChange(incomeMonth, expenseMonth);
  const weekChangeIncome = getChange(incomeWeek, expenseWeek);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
  {/* Card 1: Yearly */}
  <motion.div
    key="yearly"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="p-6 rounded-xl shadow bg-white"
  >
    <h3 className="text-gray-500 text-sm mb-4 text-center">
      Total Income & Expense This Year
    </h3>
    <div className="flex justify-between items-center  rounded-lg overflow-hidden">
      {/* Income */}
      <div className="flex-1 p-4 text-center">
        <div className="text-green-500 font-semibold text-lg">
          {formatCurrency(incomeYear)}
        </div>
        <div className="text-xs text-gray-400 mt-1">Income</div>
      </div>

      {/* Divider */}
      <div className="w-px bg-gray-300 h-12"></div>

      {/* Expense */}
      <div className="flex-1 p-4 text-center">
        <div className="text-red-500 font-semibold text-lg">
          {formatCurrency(expenseYear)}
        </div>
        <div className="text-xs text-gray-400 mt-1">Expense</div>
      </div>
    </div>
  </motion.div>

  {/* Card 2: Monthly */}
  <motion.div
    key="monthly"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="p-6 rounded-xl shadow bg-white"
  >
    <h3 className="text-gray-500 text-sm mb-4 text-center">
      Total Income & Expense This Month
    </h3>
    <div className="flex justify-between items-center rounded-lg overflow-hidden">
      <div className="flex-1 p-4 text-center">
        <div className="text-green-500 font-semibold text-lg">
          {formatCurrency(incomeMonth)}
        </div>
        <div className="text-xs text-gray-400 mt-1">Income</div>
      </div>

      <div className="w-px bg-gray-300 h-12"></div>

      <div className="flex-1 p-4 text-center">
        <div className="text-red-500 font-semibold text-lg">
          {formatCurrency(expenseMonth)}
        </div>
        <div className="text-xs text-gray-400 mt-1">Expense</div>
      </div>
    </div>
  </motion.div>

  {/* Card 3: Weekly */}
  <motion.div
    key="weekly"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="p-6 rounded-xl shadow bg-white"
  >
    <h3 className="text-gray-500 text-sm mb-4 text-center">
      Total Income & Expense This Week
    </h3>
    <div className="flex justify-between items-center rounded-lg overflow-hidden">
      <div className="flex-1 p-4 text-center">
        <div className="text-green-500 font-semibold text-lg">
          {formatCurrency(incomeWeek)}
        </div>
        <div className="text-xs text-gray-400 mt-1">Income</div>
      </div>

      <div className="w-px bg-gray-300 h-12"></div>

      <div className="flex-1 p-4 text-center">
        <div className="text-red-500 font-semibold text-lg">
          {formatCurrency(expenseWeek)}
        </div>
        <div className="text-xs text-gray-400 mt-1">Expense</div>
      </div>
    </div>
  </motion.div>
</div>


      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Line Chart */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#2ecfe3"
                strokeWidth={2}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart (unchanged) */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Income Sources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis
                angle={30}
                domain={[0, Math.max(...radarData.map((item) => item.A)) || 100]}
              />
              <Radar
                name="Income"
                dataKey="A"
                stroke="#2E2E2E"
                fill="#2ecfe3"
                fillOpacity={0.6}
              />
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
            <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
            <Bar dataKey="income" fill="#2ecfe3" name="Income" />
            <Bar dataKey="expense" fill="#ef4444" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportsBoth;
