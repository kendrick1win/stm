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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Filter, X } from "lucide-react";

interface Props {
  refreshTrigger?: number;
}

interface FilterState {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  customer: string;
  product: string;
  revenueCategory: string;
}

export default function SalesEntriesTable({ refreshTrigger }: Props) {
  const [salesEntries, setSalesEntries] = useState<SalesEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<SalesEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    customer: 'all',
    product: 'all',
    revenueCategory: 'all',
  });

  const fetchSalesEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('sales-entry')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      setSalesEntries(data || []);
      setFilteredEntries(data || []);
    } catch (error) {
      console.error('Error fetching sales entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesEntries();
  }, [refreshTrigger]);

  useEffect(() => {
    applyFilters();
  }, [filters, salesEntries]);

  const applyFilters = () => {
    let filtered = salesEntries;

    if (filters.search) {
      filtered = filtered.filter(entry =>
        entry.invoice_num?.toString().includes(filters.search) ||
        entry.customer?.toLowerCase().includes(filters.search.toLowerCase()) ||
        entry.product?.toLowerCase().includes(filters.search.toLowerCase()) ||
        entry.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(entry => entry.status === filters.status);
    }

    if (filters.customer !== 'all') {
      filtered = filtered.filter(entry => entry.customer === filters.customer);
    }

    if (filters.product !== 'all') {
      filtered = filtered.filter(entry => entry.product === filters.product);
    }

    if (filters.revenueCategory !== 'all') {
      filtered = filtered.filter(entry => entry.revenue_category === filters.revenueCategory);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(entry => 
        entry.date && new Date(entry.date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(entry => 
        entry.date && new Date(entry.date) <= new Date(filters.dateTo)
      );
    }

    setFilteredEntries(filtered);
  };

  const getUniqueValues = (key: keyof SalesEntry) => {
    return Array.from(new Set(
      salesEntries
        .map(entry => entry[key])
        .filter(value => value !== null && value !== undefined && value !== '')
    )).sort();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      customer: 'all',
      product: 'all',
      revenueCategory: 'all',
    });
  };

  const hasActiveFilters = () => {
    return filters.search !== '' || 
           filters.status !== 'all' || 
           filters.dateFrom !== '' || 
           filters.dateTo !== '' || 
           filters.customer !== 'all' || 
           filters.product !== 'all' || 
           filters.revenueCategory !== 'all';
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
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
        <div className="flex items-center justify-between">
          <CardTitle>
            Sales Entries ({filteredEntries.length}
            {filteredEntries.length !== salesEntries.length && ` of ${salesEntries.length}`})
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search invoice, customer, product..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="h-8"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {getUniqueValues('status').map((status) => (
                      <SelectItem key={status} value={status as string}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer</label>
                <Select
                  value={filters.customer}
                  onValueChange={(value) => setFilters({ ...filters, customer: value })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {getUniqueValues('customer').map((customer) => (
                      <SelectItem key={customer} value={customer as string}>
                        {customer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product</label>
                <Select
                  value={filters.product}
                  onValueChange={(value) => setFilters({ ...filters, product: value })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {getUniqueValues('product').map((product) => (
                      <SelectItem key={product} value={product as string}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Revenue Category</label>
                <Select
                  value={filters.revenueCategory}
                  onValueChange={(value) => setFilters({ ...filters, revenueCategory: value })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {getUniqueValues('revenue_category').map((category) => (
                      <SelectItem key={category} value={category as string}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Date From
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="h-8"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Date To
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="h-8"
                />
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {salesEntries.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No sales entries found. Add your first entry above.
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No entries match the current filters. Try adjusting your search criteria.
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
                {filteredEntries.map((entry) => (
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