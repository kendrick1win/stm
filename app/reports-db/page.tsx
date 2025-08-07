"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { SalesEntry } from "@/lib/store";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  TrendingUp,
  DollarSign,
  Package,
  Users,
} from "lucide-react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ReportsPage() {
  const [salesData, setSalesData] = useState<SalesEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSalesData() {
      const { data, error } = await supabase.from("sales-entry").select("*");
      if (error) {
        console.error("Error fetching sales data:", error.message);
      } else {
        setSalesData(data as SalesEntry[]);
      }
      setLoading(false);
    }

    fetchSalesData();
  }, []);

  const reportData = useMemo(() => {
    if (!salesData.length) return {
      monthlyData: [],
      categoryData: [],
      topProducts: [],
      paymentData: [],
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      pendingPayments: 0,
    };

    const monthlyRevenue = salesData.reduce((acc: Record<string, number>, sale: SalesEntry) => {
      const month = new Date(sale.date).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + sale.totalAmount;
      return acc;
    }, {});
    const monthlyData = Object.entries(monthlyRevenue).map(
      ([month, revenue]) => ({ month, revenue })
    );

    const categoryRevenue = salesData.reduce((acc: Record<string, number>, sale: SalesEntry) => {
      acc[sale.revenueCategory] =
        (acc[sale.revenueCategory] || 0) + sale.totalAmount;
      return acc;
    }, {});
    const categoryData = Object.entries(categoryRevenue).map(
      ([category, revenue]) => ({
        category,
        revenue,
        percentage: (
          (revenue /
            salesData.reduce((sum, sale) => sum + sale.totalAmount, 0)) *
          100
        ).toFixed(1),
      })
    );

    const productSales = salesData.reduce((acc: Record<string, number>, sale: SalesEntry) => {
      acc[sale.product] = (acc[sale.product] || 0) + sale.quantity;
      return acc;
    }, {});
    const topProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([product, quantity]) => ({ product, quantity }));

    const paymentStatus = salesData.reduce((acc: Record<string, number>, sale: SalesEntry) => {
      acc[sale.paymentStatus] = (acc[sale.paymentStatus] || 0) + 1;
      return acc;
    }, {});
    const paymentData = Object.entries(paymentStatus).map(
      ([status, count]) => ({
        status,
        count,
        percentage: ((count / salesData.length) * 100).toFixed(1),
      })
    );

    // const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalRevenue = salesData.reduce(
      (sum, sale) => sum + (Number(sale.total_revenue) || 0),
      0
    );


    return {
      monthlyData,
      categoryData,
      topProducts,
      paymentData,
      totalRevenue,
      totalOrders: salesData.length,
      averageOrderValue: salesData.length > 0 ? totalRevenue / salesData.length : 0,
      pendingPayments: salesData.filter(
        (sale) => sale.paymentStatus === "Pending" || sale.paymentStatus === "Partial"
      ).length,
    };
  }, [salesData]);

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report...`);
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Reports Overview (with DB)</h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive analytics and insights for your pharmaceutical sales
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportReport("PDF")}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport("Excel")}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Total sales revenue
            </p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total number of sales
            </p>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${reportData.averageOrderValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average revenue per sale
            </p>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.pendingPayments}
            </div>
            <p className="text-xs text-muted-foreground">
              Orders awaiting payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="payments">Payment Analysis</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
              <CardDescription>Revenue performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) =>
                      `${category} (${percentage}%)`
                    }
                    outerRadius={80}
                    dataKey="revenue"
                  >
                    {reportData.categoryData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>By quantity sold</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status Distribution</CardTitle>
              <CardDescription>Status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.paymentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percentage }) =>
                      `${status} (${percentage}%)`
                    }
                    outerRadius={80}
                    dataKey="count"
                  >
                    {reportData.paymentData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
