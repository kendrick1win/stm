"use client";

import { useState, useEffect } from "react";
import { SalesEntry } from "@/lib/store";
import { supabase } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  refreshTrigger?: number;
}

export default function SalesEntriesTable({ refreshTrigger }: Props) {
  const [salesEntries, setSalesEntries] = useState<SalesEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSalesEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('sales-entry')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      setSalesEntries(data || []);
    } catch (error) {
      console.error('Error fetching sales entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesEntries();
  }, [refreshTrigger]);

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Entries ({salesEntries.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {salesEntries.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No sales entries found. Add your first entry above.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Net Revenue</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.invoice_num}
                    </TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.customer || '-'}</TableCell>
                    <TableCell>{entry.product || '-'}</TableCell>
                    <TableCell>
                      {entry.quantity} {entry.unit || ''}
                    </TableCell>
                    <TableCell>{formatCurrency(entry.unit_price)}</TableCell>
                    <TableCell>{formatCurrency(entry.total_revenue)}</TableCell>
                    <TableCell>{formatCurrency(entry.net_revenue)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : entry.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}