import React, { useState, useEffect } from "react";
import { MoreVertical, Plus, ChevronsUpDown, Edit, Trash } from "lucide-react";
import axios from "../api/axios";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import TransactionsToCsv from "../components/TransactionsToCsv";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [sortByDate, setSortByDate] = useState("unsorted");
  const [sortByAmount, setSortByAmount] = useState("unsorted");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/finance/transactions/");
      const transformed = response.data.map((txn) => {
        const dateObj = new Date(txn.date);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = dateObj.toLocaleString("default", { month: "long" });
        const year = dateObj.getFullYear();
        const formattedDate = `${day} ${month} ${year}`;

        return {
          ...txn,
          amount: Number(txn.amount),
          date: formattedDate,
          time: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
      });
      setTransactions(transformed);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const handleAddTransaction = async (newTxn) => {
    try {
      await axios.post("/finance/transactions/", newTxn);
      fetchTransactions();
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  const handleEditTransaction = async (updatedTxn) => {
    try {
      await axios.put(`/finance/transactions/${editingTransaction.id}/update/`, updatedTxn);
      fetchTransactions();
      setShowEditModal(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Failed to edit transaction:", error);
    }
  };

  const handleDelete = async (transactionId) => {
    try {
      await axios.delete(`/finance/transactions/${transactionId}/`);
      fetchTransactions();
      setOpenMenuIndex(null);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const filtered = transactions.filter((t) => {
    if (filter !== "all" && t.type !== filter) return false;
    if (searchId && !t.id.toString().includes(searchId)) return false;
    return true;
  });

  const sortTransactions = (transactions, sortByDate, sortByAmount) => {
    let sorted = [...transactions];
    if (sortByDate === "earliestToLatest") {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortByDate === "latestToEarliest") {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (sortByAmount === "highestToLowest") {
      sorted.sort((a, b) => b.amount - a.amount);
    } else if (sortByAmount === "lowestToHighest") {
      sorted.sort((a, b) => a.amount - b.amount);
    }
    return sorted;
  };

  const sortedTransactions = sortTransactions(filtered, sortByDate, sortByAmount);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <div className="p-6" style={{ backgroundColor: "#f9fafb" }}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Transactions</h2>

        {/* Filter, Search, Add */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-6">
            {["all", "income", "expense"].map((type) => (
              <button
                key={type}
                className={`text-sm font-semibold capitalize transition relative ${
                  filter === type
                    ? "text-[#2ecfe3] after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-[#2ecfe3]"
                    : "text-gray-500"
                }`}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
            <div className="flex items-center border rounded px-3 py-2 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" />
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

          <div className="flex items-center gap-4">
          <TransactionsToCsv transactions={sortedTransactions} />

          {/* Add Transaction button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#2ecfe3] text-white rounded hover:bg-[#24b9cc] transition"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            Add Transaction
          </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="min-w-[1100px] bg-[#f5f5f5] px-8 py-4 border rounded-t">
            <div className="grid grid-cols-[1rem_140px_120px_280px_220px_140px_140px_140px] gap-x-20 text-xs font-bold text-gray-700 text-center">
              <div></div>
              {["Date", "Time", "Transaction ID", "Description", "Amount", "Type", "Action"].map((label, idx) => (
                <div key={idx} className="flex items-center justify-center gap-1">
                  {label}
                  {(label === "Date" || label === "Amount") && (
                    <ChevronsUpDown
                      className="w-4 h-4 text-[#2ecfe3]"
                      onClick={() => {
                        if (label === "Date") {
                          setSortByDate(
                            sortByDate === "unsorted" ? "earliestToLatest" :
                            sortByDate === "earliestToLatest" ? "latestToEarliest" : "unsorted"
                          );
                        }
                        if (label === "Amount") {
                          setSortByAmount(
                            sortByAmount === "unsorted" ? "highestToLowest" :
                            sortByAmount === "highestToLowest" ? "lowestToHighest" : "unsorted"
                          );
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div className="min-w-[1100px]">
            {sortedTransactions.map((txn) => (
              <div
                key={txn.id}
                className="grid grid-cols-[1rem_140px_120px_280px_220px_140px_140px_140px] gap-x-20 items-center bg-white px-8 py-4 text-sm text-center border-t"
              >
                <div className="flex justify-center">
                  <span className={`block w-3 h-3 rounded-full ${txn.type === "income" ? "bg-green-500" : "bg-red-500"}`}></span>
                </div>
                <div>{txn.date}</div>
                <div>{txn.time}</div>
                <div className="truncate">{txn.id}</div>
                <div className="truncate">{txn.description}</div>
                <div className="font-mono font-medium text-center">€{txn.amount.toFixed(2)}</div>
                <div>
                  <span className={`text-sm font-semibold ${txn.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingTransaction(txn);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                  </button>
                  <button onClick={() => handleDelete(txn.id)}>
                    <Trash className="w-5 h-5 text-gray-600 hover:text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Modal */}
        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTransaction}
        />

        {/* Edit Modal */}
        {showEditModal && editingTransaction && (
          <EditTransactionModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            transaction={editingTransaction}
            onSubmit={handleEditTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
