import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReportsIncome from '../components/ReportsIncome'; // adjust path if needed

export default function Reports() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'both';

  const [data, setData] = useState([]);

  useEffect(() => {
    if (view === 'income') {
      console.log("Show only income data");
    } else if (view === 'expenses') {
      console.log("Show only expense data");
    } else {
      console.log("Show all data");
    }

    // Fetch and filter data as needed
  }, [view]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 capitalize">{view} Report</h2>

      {/* Conditional rendering based on `view` */}
      {view === 'income' ? (
        <ReportsIncome />
      ) : (
        <p>This is the {view} report view.</p>
      )}
    </div>
  );
}
