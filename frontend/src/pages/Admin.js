import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Trash } from "lucide-react";
import { motion } from "framer-motion";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");

  const [thisYear, setThisYear]   = useState(0);
  const [lastYear, setLastYear]   = useState(0);
  const [thisMonth, setThisMonth] = useState(0);
  const [lastMonth, setLastMonth] = useState(0);
  const [thisWeek, setThisWeek]   = useState(0);
  const [lastWeek, setLastWeek]   = useState(0);

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    axios
      .get("/users/admin/users/")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to load users", err));
  }, []);

  useEffect(() => {
    const now = new Date();
    const startOfYear      = new Date(now.getFullYear(), 0, 1);
    const startOfLastYear  = new Date(now.getFullYear() - 1, 0, 1);
    const endOfLastYear    = new Date(now.getFullYear(), 0, 0);

    const startOfMonth     = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0);

    const startOfWeek      = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfLastWeek  = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const endOfLastWeek    = new Date(startOfWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);

    let ty = 0, ly = 0, tm = 0, lm = 0, tw = 0, lw = 0;
    const monthlyCounts = Array(12).fill(0);

    users.forEach((u) => {
      const c = new Date(u.created_at);
      if (c >= startOfYear) {
        ty++;
        if (c.getFullYear() === now.getFullYear()) {
          monthlyCounts[c.getMonth()]++;
        }
      } else if (c >= startOfLastYear && c <= endOfLastYear) {
        ly++;
      }

      if (c >= startOfMonth) tm++;
      else if (c >= startOfLastMonth && c <= endOfLastMonth) lm++;

      if (c >= startOfWeek) tw++;
      else if (c >= startOfLastWeek && c <= endOfLastWeek) lw++;
    });

    setThisYear(ty);
    setLastYear(ly);
    setThisMonth(tm);
    setLastMonth(lm);
    setThisWeek(tw);
    setLastWeek(lw);

    const monthLabels = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    setMonthlyData(
      monthLabels.map((m, idx) => ({ month: m, count: monthlyCounts[idx] }))
    );
  }, [users]);

  const getChange = (current, previous) => {
    if (previous === 0) return { percent: 100, direction: "up" };
    const diff = current - previous;
    const pct = (diff / previous) * 100;
    return {
      percent: Math.abs(pct).toFixed(1),
      direction: pct >= 0 ? "up" : "down"
    };
  };

  const cards = [
    { label: "This Year",  value: thisYear,  change: getChange(thisYear,  lastYear) },
    { label: "This Month", value: thisMonth, change: getChange(thisMonth, lastMonth) },
    { label: "This Week",  value: thisWeek,  change: getChange(thisWeek,  lastWeek) },
  ];

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

  const formatNumber = (n) => n.toLocaleString();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/users/admin/users/${id}/`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.id.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Users</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {cards.map(({ label, value, change }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (idx + 1) }}
            className="p-6 rounded-xl shadow bg-white flex flex-col items-center"
          >
            <h3 className="text-gray-500 text-sm mb-2">New Users {label}</h3>
            <div className="text-2xl font-bold text-[#2ecfe3]">
              {formatNumber(value)}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <AnimatedArrow direction={change.direction} />
              <span
                className={`text-sm ${
                  change.direction === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {change.direction === "up" ? "+" : "-"}
                {change.percent}% vs last {label.toLowerCase()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search bar */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center border rounded px-3 py-2 bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search ID"
            className="outline-none text-sm ml-3 w-48"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-10">
        {/* Header */}
        <div className="min-w-[1100px] bg-[#f5f5f5] px-8 py-4 border rounded-t">
          <div className="grid grid-cols-[1rem_180px_180px_180px_200px_100px_80px_80px] gap-x-20 text-xs font-bold text-gray-700 text-center">
            <div></div>
            <div>Created At</div>
            <div>Email</div>
            <div>Username</div>
            <div>ID</div>
            <div>Staff?</div>
            <div>Balance</div>
            <div>Action</div>
          </div>
        </div>
        {/* Body */}
        <div className="min-w-[1100px]">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[1rem_180px_180px_180px_200px_100px_80px_80px] gap-x-20 items-center bg-white px-8 py-4 text-sm text-center border-t"
            >
              <div></div>
              <div>{new Date(u.created_at).toLocaleString()}</div>
              <div className="truncate">{u.email}</div>
              <div>{u.username}</div>
              <div className="truncate">{u.id}</div>
              <div>{u.is_staff ? "Yes" : "No"}</div>
              <div>€{Number(u.balance).toFixed(2)}</div>
              <div className="flex justify-center">
                <button onClick={() => handleDelete(u.id)}>
                  <Trash className="w-5 h-5 text-gray-600 hover:text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Sign-up Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="col-span-3 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            New Users by Month
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => v.toFixed(0)} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2ecfe3"
                strokeWidth={2}
                name="Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
