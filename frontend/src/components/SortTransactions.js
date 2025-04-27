import React, { useState } from "react";

const SortTransactions = ({ setSortedTransactions, transactions }) => {
  const [dateSort, setDateSort] = useState("unsorted");
  const [amountSort, setAmountSort] = useState("unsorted");

  const sortByDate = (order) => {
    let sorted = [...transactions];
    if (order === "ascending") {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (order === "descending") {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    setSortedTransactions(sorted);
    setDateSort(order);
  };

  const sortByAmount = (order) => {
    let sorted = [...transactions];
    if (order === "highToLow") {
      sorted.sort((a, b) => b.amount - a.amount);
    } else if (order === "lowToHigh") {
      sorted.sort((a, b) => a.amount - b.amount);
    }
    setSortedTransactions(sorted);
    setAmountSort(order);
  };

  return (
    <div>
      {/* Date sorting */}
      <button onClick={() => sortByDate(dateSort === "unsorted" || dateSort === "descending" ? "ascending" : "descending")}>
        Date {dateSort === "unsorted" ? "" : dateSort === "ascending" ? "↑" : "↓"}
      </button>

      {/* Amount sorting */}
      <button onClick={() => sortByAmount(amountSort === "unsorted" || amountSort === "lowToHigh" ? "highToLow" : "lowToHigh")}>
        Amount {amountSort === "unsorted" ? "" : amountSort === "highToLow" ? "↓" : "↑"}
      </button>
    </div>
  );
};

export default SortTransactions;
