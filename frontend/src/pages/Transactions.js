import React, { useState, useEffect } from "react";
import { MoreVertical, Plus } from "lucide-react";
import axios from "../api/axios";
import AddTransactionModal from "../components/AddTransactionModal";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/finance/transactions/");
      const transformed = response.data.map(txn => ({
        ...txn,
        date: new Date(txn.date).toLocaleDateString(),
        time: new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setTransactions(transformed);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleAddTransaction = async (newTxn) => {
    try {
      await axios.post("/finance/transactions/", newTxn);
      fetchTransactions();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to add transaction:", error);
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
  

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#e4e6e7" }}>
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Manage Transactions</h2>

      {/* Filter and Add */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex border rounded overflow-hidden divide-x divide-gray-300">
          {["all", "income", "expense"].map((type) => (
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

        <button
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="min-w-[1100px] bg-white rounded px-8 py-4 mb-2 shadow-sm">
          <div className="grid grid-cols-[1rem_140px_120px_280px_220px_140px_140px_40px] gap-x-24 text-xs font-semibold text-gray-500 text-center">
            <div></div>
            <div>Date</div>
            <div>Time</div>
            <div>Transaction ID</div>
            <div>Description</div>
            <div>Amount</div>
            <div>Type</div>
            <div></div>
          </div>
        </div>

        {/* Rows */}
        <div className="min-w-[1100px] space-y-3">
          {filtered.map((txn, idx) => (
            <div
              key={txn.id}
              className="grid grid-cols-[1rem_140px_120px_280px_220px_140px_140px_40px] gap-x-24 items-center bg-white rounded shadow-md px-8 py-4 text-sm text-center"
            >
              <div className="flex justify-center">
                <span className={`block w-3 h-3 rounded-full ${txn.type === "income" ? "bg-green-500" : "bg-red-500"}`}></span>
              </div>
              <div>{txn.date}</div>
              <div>{txn.time}</div>
              <div className="truncate">{txn.id}</div>
              <div className="truncate">{txn.description}</div>
              <div className="font-medium">€{txn.amount}</div>
              <div>
                <span className={`text-sm font-semibold ${txn.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                </span>
              </div>
              <div className="relative justify-self-end">
                <MoreVertical className="cursor-pointer" size={18} onClick={() => toggleMenu(idx)} />
                {openMenuIndex === idx && (
                  <div className="absolute right-0 top-6 bg-white border rounded-md shadow-md z-10 w-28">
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => handleDelete(txn.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
    </div>
  );
};

export default TransactionsPage;
