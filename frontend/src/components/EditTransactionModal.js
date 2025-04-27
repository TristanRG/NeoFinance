import React, { useState, useEffect } from "react";

const EditTransactionModal = ({ isOpen, onClose, transaction, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    recurrence: "",
  });
  const [loadedTransaction, setLoadedTransaction] = useState(null);

  const expenseCategories = [
    "Food", "Transport", "Utilities", "Shopping", "Entertainment", "Healthcare"
  ];
  const incomeCategories = [
    "Salary", "Freelance", "Investments", "Consulting", "Online Sales", "Gifts"
  ];

  useEffect(() => {
    if (transaction) {
      setLoadedTransaction(transaction);
      setFormData({
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description || "",
        recurrence: transaction.recurrence || "none",
      });
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDate = new Date(loadedTransaction.date).toISOString();

    const updatedTransaction = {
      id: loadedTransaction.id,
      user: loadedTransaction.user, 
      category: formData.category, 
      amount: parseFloat(formData.amount), 
      currency: loadedTransaction.currency,
      converted_amount: loadedTransaction.converted_amount,
      date: formattedDate, 
      description: formData.description || loadedTransaction.description, 
      recurrence: formData.recurrence || loadedTransaction.recurrence, 
      type: loadedTransaction.type, 
    };

    onSubmit(updatedTransaction); 
  };

  if (!isOpen || !loadedTransaction) return null;

  const categories =
    loadedTransaction.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Amount (editable) */}
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="border px-3 py-2 rounded"
            required
          />

          {/* Category (editable, dynamically filtered based on transaction type) */}
          <select
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="border px-3 py-2 rounded"
            required
          >
            {categories.map((category) => (
                <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Description (editable) */}
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />

          {/* Recurrence (editable) */}
          <select
            name="recurrence"
            value={formData.recurrence}
            onChange={(e) =>
              setFormData({ ...formData, recurrence: e.target.value })
            }
            className="border px-3 py-2 rounded"
            required
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
