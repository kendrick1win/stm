"use client";

import { useState } from "react";
import SalesDataEntryForm from "@/components/sales-data-entry-form";
import SalesEntriesTable from "@/components/sales-entries-table";

export default function SalesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEntryAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales Entry</h2>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Add New Sales Entry</h3>
          <SalesDataEntryForm onEntryAdded={handleEntryAdded} />
        </div>
        
        <SalesEntriesTable refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
