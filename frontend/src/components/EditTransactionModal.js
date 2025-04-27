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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount (editable) */}
          <div className="flex flex-col">
            <label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount</label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecfe3]"
              required
            />
          </div>

          {/* Category (editable, dynamically filtered based on transaction type) */}
          <div className="flex flex-col">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecfe3]"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description (editable) */}
          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
            <input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecfe3]"
            />
          </div>

          {/* Recurrence (editable) */}
          <div className="flex flex-col">
            <label htmlFor="recurrence" className="text-sm font-medium text-gray-700">Recurrence</label>
            <select
              id="recurrence"
              name="recurrence"
              value={formData.recurrence}
              onChange={(e) =>
                setFormData({ ...formData, recurrence: e.target.value })
              }
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecfe3]"
              required
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#2ecfe3] text-white px-6 py-2 rounded-lg hover:bg-[#2bafcc] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
