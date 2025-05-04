import React, { useState } from "react";

const TransactionsToCsv = ({ transactions }) => {
  const exportCSV = (filterType) => {
    const headers = ["Date", "Time", "Transaction ID", "Description", "Amount", "Type", "Category"];

    const filtered = transactions.filter(txn => {
      if (filterType === "all") return true;
      return txn.type === filterType;
    });

    const rows = filtered.map(txn => [
      txn.date,
      txn.time,
      txn.id,
      txn.description,
      txn.amount.toFixed(2),
      txn.type,
      txn.category
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filterType}_transactions.csv`;
    link.click();
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-[#2ecfe3] text-white rounded hover:bg-[#24b9cc] transition"
      >
        Export CSV ▾
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
          <button
            onClick={() => {
              exportCSV("all");
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Export All
          </button>
          <button
            onClick={() => {
              exportCSV("income");
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Export Income
          </button>
          <button
            onClick={() => {
              exportCSV("expense");
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Export Expenses
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionsToCsv;
