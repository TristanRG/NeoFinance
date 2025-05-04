import React, { useState, useEffect } from "react";

const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Healthcare",
];

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Consulting",
  "Online Sales",
  "Gifts",
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
    category: EXPENSE_CATEGORIES[0],
    description: "",
  });

  useEffect(() => {
    const amt = parseFloat(form.amount);
    if (!isNaN(amt)) {
      const inferred = amt < 0 ? "expense" : "income";
      if (inferred !== form.type) {
        setForm((prev) => ({
          ...prev,
          type: inferred,
          category:
            inferred === "income"
              ? INCOME_CATEGORIES[0]
              : EXPENSE_CATEGORIES[0],
        }));
      }
    }
  }, [form.amount]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      const newCats = value === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      setForm((prev) => ({
        ...prev,
        type: value,
        category: newCats[0],
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!form.amount || !form.category) return;
    onSubmit({
      amount: parseFloat(form.amount),
      description: form.description,
      recurrence: form.recurrence,
      category: form.category,
    });
    setForm({
      amount: "",
      type: "expense",
      recurrence: "none",
      category: EXPENSE_CATEGORIES[0],
      description: "",
    });
  };

  if (!isOpen) return null;

  const availableCategories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] space-y-4">
        <h3 className="text-lg font-semibold">Add New Transaction</h3>

        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="e.g. -50.00 for expense"
              value={form.amount}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#2ecfe3]"
            />
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-sm font-medium">Recurrence</label>
            <select
              name="recurrence"
              value={form.recurrence}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#2ecfe3]"
            >
              {RECURRENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#2ecfe3]"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">
              Description (optional)
            </label>
            <textarea
              name="description"
              placeholder="Notes..."
              value={form.description}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#2ecfe3]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#2ecfe3] text-white rounded hover:bg-[#2bb2a8]"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
