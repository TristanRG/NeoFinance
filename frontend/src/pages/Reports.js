import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Reports() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'both';

  const [data, setData] = useState([]);

  useEffect(() => {
    // Example logic based on selected view
    if (view === 'income') {
      console.log("Show only income data");
    } else if (view === 'expenses') {
      console.log("Show only expense data");
    } else {
      console.log("Show all data");
    }

    // Fetch and filter data as needed here
  }, [view]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 capitalize">{view} Report</h2>
      <div>
        {/* Render filtered data here */}
        {/* For now, you can just show a placeholder */}
        <p>This is the {view} report view.</p>
      </div>
    </div>
  );
}
