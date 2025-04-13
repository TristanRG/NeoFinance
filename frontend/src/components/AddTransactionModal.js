import React, { useState } from "react";

const CATEGORY_CHOICES = [
  "Food",
  "Transport",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Salary",
  "Freelance",
];

const RECURRENCE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const AddTransactionModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    recurrence: "none",
    category: CATEGORY_CHOICES[0],
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.amount || !form.category) return;
    onSubmit({
      amount: parseFloat(form.amount),
      description: form.description,
      type: form.type,
      recurrence: form.recurrence,
      category: form.category,
    });
    setForm({
      amount: "",
      description: "",
      type: "expense",
      recurrence: "none",
      category: CATEGORY_CHOICES[0],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] space-y-4">
        <h3 className="text-lg font-semibold">Add New Transaction</h3>
        <div className="flex flex-col space-y-3">
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Amount (e.g. 50.00)"
            value={form.amount}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="income"
                checked={form.type === "income"}
                onChange={handleChange}
                className="mr-2"
              />
              Income
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={form.type === "expense"}
                onChange={handleChange}
                className="mr-2"
              />
              Expense
            </label>
          </div>

          <select
            name="recurrence"
            value={form.recurrence}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            {RECURRENCE_OPTIONS.map((rec) => (
              <option key={rec.value} value={rec.value}>
                {rec.label}
              </option>
            ))}
          </select>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            {CATEGORY_CHOICES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
