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

export default function ReportsBoth() {
  const { user } = useContext(AuthContext);

  const [incomeYear, setIncomeYear]     = useState(0);
  const [expenseYear, setExpenseYear]   = useState(0);
  const [incomeMonth, setIncomeMonth]   = useState(0);
  const [expenseMonth, setExpenseMonth] = useState(0);
  const [incomeWeek, setIncomeWeek]     = useState(0);
  const [expenseWeek, setExpenseWeek]   = useState(0);

  const [monthlyData, setMonthlyData]       = useState([]);
  const [incomeRadarData, setIncomeRadar]   = useState([]);
  const [expenseRadarData, setExpenseRadar] = useState([]);

  const incomeCategories  = ["Salary","Freelance","Investments","Consulting","Online Sales","Gifts"];
  const expenseCategories = ["Food","Transport","Utilities","Shopping","Entertainment","Healthcare"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/finance/transactions/");
        const txns = res.data;
        const now = new Date(), thisYear = now.getFullYear();

        const startOfMonth = new Date(thisYear, now.getMonth(), 1);
        const startOfWeek  = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        let iY=0, eY=0, iM=0, eM=0, iW=0, eW=0;
        const incomeMonthly  = Array(12).fill(0);
        const expenseMonthly = Array(12).fill(0);
        const incomeTotals   = incomeCategories.reduce((o,cat)=>({...o,[cat]:0}), {});
        const expenseTotals  = expenseCategories.reduce((o,cat)=>({...o,[cat]:0}), {});

        txns.forEach(t => {
          const d = new Date(t.date),
                amt = parseFloat(t.amount),
                m = d.getMonth();
          if (d.getFullYear()===thisYear) {
            if (t.type==="income") {
              iY+=amt;
              if(d>=startOfMonth) iM+=amt;
              if(d>=startOfWeek)  iW+=amt;
              incomeMonthly[m]+=amt;
              if (incomeTotals[t.category] !== undefined)
                incomeTotals[t.category]+=amt;
            } else {
              eY+=amt;
              if(d>=startOfMonth) eM+=amt;
              if(d>=startOfWeek)  eW+=amt;
              expenseMonthly[m]+=amt;
              if (expenseTotals[t.category] !== undefined)
                expenseTotals[t.category]+=amt;
            }
          }
        });

        setIncomeYear(iY);
        setExpenseYear(eY);
        setIncomeMonth(iM);
        setExpenseMonth(eM);
        setIncomeWeek(iW);
        setExpenseWeek(eW);

        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        setMonthlyData(
          months.map((m,idx)=>({
            month:   m,
            income:  incomeMonthly[idx],
            expense: expenseMonthly[idx]
          }))
        );

        setIncomeRadar(incomeCategories.map(cat=>({ subject: cat, A: incomeTotals[cat] })));
        setExpenseRadar(expenseCategories.map(cat=>({ subject: cat, A: expenseTotals[cat] })));

      } catch(err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = a => `€${a.toFixed(2)}`;
  const getChange = (cur,prev) => {
    if (prev===0) return { percent:100, direction:"up" };
    const change = ((cur-prev)/prev)*100;
    return { percent:Math.abs(change).toFixed(1), direction: change>=0?"up":"down" };
  };

  const AnimatedArrow = ({ direction }) => {
    const Icon = direction==="up" ? ArrowUpRight : ArrowDownRight;
    return (
      <motion.div
        initial={{opacity:0,y:5}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.4}}
        className={`flex items-center gap-1 text-sm ${
          direction==="up" ? "text-green-500" : "text-red-500"
        }`}
      >
        <Icon size={16}/>
      </motion.div>
    );
  };

  const yearChange  = getChange(incomeYear,  expenseYear);
  const monthChange = getChange(incomeMonth, expenseMonth);
  const weekChange  = getChange(incomeWeek,  expenseWeek);

  const summary = [
    { label:"This Year",  income:incomeYear,  expense:expenseYear,  change:yearChange },
    { label:"This Month", income:incomeMonth, expense:expenseMonth, change:monthChange },
    { label:"This Week",  income:incomeWeek,  expense:expenseWeek,  change:weekChange },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {summary.map(({ label, income, expense, change }, i) => (
          <motion.div
            key={label}
            initial={{opacity:0,y:10}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.1*(i+1)}}
            className="p-6 rounded-xl shadow bg-white"
          >
            <h3 className="text-gray-500 text-sm mb-4 text-center">
              Total Income & Expense {label}
            </h3>
            <div className="flex">
              {/* Income Block */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <AnimatedArrow direction={change.direction}/>
                  <span className="text-green-500 font-semibold text-lg">
                    {formatCurrency(income)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Income</div>
                <div
                  className={`text-xs mt-1 ${
                    change.direction === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {change.direction === "up" ? "+" : "-"}
                  {change.percent}% vs last {label.split(" ")[1].toLowerCase()}
                </div>
              </div>

              <div className="w-px bg-gray-300 mx-2"></div>

              {/* Expense Block */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <AnimatedArrow direction={change.direction}/>
                  <span className="text-red-500 font-semibold text-lg">
                    {formatCurrency(expense)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Expense</div>
                <div
                  className={`text-xs mt-1 ${
                    change.direction === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {change.direction === "up" ? "+" : "-"}
                  {change.percent}% vs last {label.split(" ")[1].toLowerCase()}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Line + Income Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={v=>`€${v.toFixed(2)}`} />
              <Line type="monotone" dataKey="income"  stroke="#2ecfe3" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Income Sources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={incomeRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis
                angle={30}
                domain={[0, Math.max(...incomeRadarData.map(d=>d.A))||100]}
              />
              <Radar name="Income" dataKey="A" stroke="#2E2E2E" fill="#2ecfe3" fillOpacity={0.6}/>
              <Tooltip formatter={v=>`€${v.toFixed(2)}`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Bar + Expense Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip formatter={v=>`€${v.toFixed(2)}`} />
              <Bar dataKey="income"  fill="#2ecfe3" name="Income"/>
              <Bar dataKey="expense" fill="#ef4444" name="Expense"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Expense Sources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={expenseRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis
                angle={30}
                domain={[0, Math.max(...expenseRadarData.map(d=>d.A))||100]}
              />
              <Radar name="Expense" dataKey="A" stroke="#2E2E2E" fill="#ef4444" fillOpacity={0.6}/>
              <Tooltip formatter={v=>`€${v.toFixed(2)}`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
