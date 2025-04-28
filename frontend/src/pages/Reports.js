import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReportsIncome from '../components/ReportsIncome'; 
import ReportsExpenses from '../components/ReportsExpenses'; 
import ReportsBoth from '../components/ReportsBoth'; 

export default function Reports() {
  const [searchParams] = useSearchParams();
  const view = (searchParams.get('view') || 'both').toLowerCase();

  const [data, setData] = useState([]);

  useEffect(() => {
    if (view === 'income') {
      console.log("Show only income data");
    } else if (view === 'expenses') {
      console.log("Show only expense data");
    } else {
      console.log("Show both data");
    }
  }, [view]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 capitalize">{view} Report</h2>

      {view === 'income' && <ReportsIncome />}
      {view === 'expenses' && <ReportsExpenses />}
      {view === 'both' && <ReportsBoth />} 
    </div>
  );
}
