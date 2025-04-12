import React, { useState } from "react";
import { MoreVertical, Plus } from "lucide-react";

const transactions = [
  { date: "20 Dec 21", time: "12.20 AM", id: "Jav1245784524132", name: "Horew Doree", amount: "$823", type: "income" },
  { date: "18 Dec 21", time: "11.58 PM", id: "Jav1245784124012", name: "Karee Palu", amount: "$1023", type: "income" },
  { date: "18 Dec 21", time: "10.56 PM", id: "Jav1451244545454", name: "Team6", amount: "$2125", type: "income" },
  { date: "18 Dec 21", time: "10.21 PM", id: "Jav1245754156461", name: "Matheu pre", amount: "$500", type: "expense" },
  { date: "18 Dec 21", time: "09.32 AM", id: "Jav1241245111212", name: "Hirut hasna", amount: "$289.01", type: "income" },
  { date: "17 Dec 21", time: "12.20 PM", id: "Jav124500120011", name: "picyim vit", amount: "$253", type: "income" },
  { date: "17 Dec 21", time: "12.02 AM", id: "Jav1245780027800", name: "Matheu pr", amount: "$1202", type: "income" },
];

const TransactionTable = () => {
  const [filter, setFilter] = useState("all");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Manage Transactions</h2>

      {/* Filter and Add */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex border rounded overflow-hidden divide-x divide-gray-300">
          {["all", "income", "expense"].map((type, index) => (
            <button
              key={type}
              className={`w-28 py-2 text-sm font-medium text-center transition ${
                filter === type ? "bg-black text-white" : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="min-w-[1100px] bg-gray-100 rounded px-8 py-4 mb-2 shadow-sm">
          <div className="grid grid-cols-[1rem_140px_120px_280px_220px_140px_140px_40px] gap-x-24 text-xs font-semibold text-gray-500 text-center">
            <div></div>
            <div>Date</div>
            <div>Time</div>
            <div>Transaction ID</div>
            <div>Name</div>
            <div>Amount</div>
            <div>Type</div>
            <div></div>
          </div>
        </div>

        {/* Transaction Rows */}
        <div className="min-w-[1100px] space-y-3">
          {filtered.map((txn, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1rem_140px_120px_280px_220px_140px_140px_40px] gap-x-24 items-center bg-white rounded shadow-md px-8 py-4 text-sm text-center"
            >
              {/* Dot */}
              <div className="flex justify-center">
                <span
                  className={`block w-3 h-3 rounded-full ${
                    txn.type === "income" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              </div>
              <div>{txn.date}</div>
              <div>{txn.time}</div>
              <div className="truncate">{txn.id}</div>
              <div className="truncate">{txn.name}</div>
              <div className="font-medium">{txn.amount}</div>
              <div>
                <span
                  className={`text-sm font-semibold ${
                    txn.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                </span>
              </div>

              {/* Options */}
              <div className="relative justify-self-end">
                <MoreVertical
                  className="cursor-pointer"
                  size={18}
                  onClick={() => toggleMenu(idx)}
                />
                {openMenuIndex === idx && (
                  <div className="absolute right-0 top-6 bg-white border rounded-md shadow-md z-10 w-28">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
