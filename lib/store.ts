"use client";

export type SalesEntry = {
  id: string;
  status: string;
  invoiceNo: string;
  date: string;
  month: string;
  termDays: number;
  dueDate: string;
  description: string;
  revenueCategory: string;
  revenueType: string;
  customer: string;
  product: string;
  quantity: number;
  unit: string;
  price: number;
  revenue: number;
  percentage: number;
  discountAmount: number;
  totalAmount: number;
  cashReceived: number;
  notes: string;
  paymentStatus: string;
  remainingBalance: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  status: string;
  totalOrders: number;
  totalRevenue: number;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  minStock: number;
  supplier: string;
  status: string;
  createdAt: string;
};

export const sampleSalesData: SalesEntry[] = [
  {
    id: "1",
    status: "Completed",
    invoiceNo: "INV-001",
    date: "2024-01-15",
    month: "January",
    termDays: 30,
    dueDate: "2024-02-14",
    description: "Monthly supply order",
    revenueCategory: "Prescription",
    revenueType: "Direct",
    customer: "Hospital A",
    product: "Amoxicillin",
    quantity: 100,
    unit: "Box",
    price: 25.5,
    revenue: 2550,
    percentage: 5,
    discountAmount: 127.5,
    totalAmount: 2422.5,
    cashReceived: 2422.5,
    notes: "Delivered on time",
    paymentStatus: "Paid",
    remainingBalance: 0,
  },
  {
    id: "2",
    status: "Pending",
    invoiceNo: "INV-002",
    date: "2024-01-20",
    month: "January",
    termDays: 45,
    dueDate: "2024-03-05",
    description: "Emergency order",
    revenueCategory: "OTC",
    revenueType: "Wholesale",
    customer: "Pharmacy B",
    product: "Paracetamol",
    quantity: 200,
    unit: "Box",
    price: 12.75,
    revenue: 2550,
    percentage: 10,
    discountAmount: 255,
    totalAmount: 2295,
    cashReceived: 1000,
    notes: "Partial payment received",
    paymentStatus: "Partial",
    remainingBalance: 1295,
  },
];

export const sampleCustomers: Customer[] = [
  {
    id: "1",
    name: "Hospital A",
    email: "orders@hospitala.com",
    phone: "+1-555-0101",
    address: "123 Medical Center Dr, City, State 12345",
    type: "Hospital",
    status: "Active",
    totalOrders: 45,
    totalRevenue: 125000,
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Pharmacy B",
    email: "manager@pharmacyb.com",
    phone: "+1-555-0102",
    address: "456 Main St, City, State 12345",
    type: "Pharmacy",
    status: "Active",
    totalOrders: 32,
    totalRevenue: 85000,
    createdAt: "2023-02-20",
  },
];

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Amoxicillin",
    category: "Prescription",
    description: "Antibiotic medication",
    price: 25.5,
    unit: "Box",
    stock: 500,
    minStock: 50,
    supplier: "PharmaCorp",
    status: "Active",
    createdAt: "2023-01-10",
  },
  {
    id: "2",
    name: "Paracetamol",
    category: "OTC",
    description: "Pain reliever and fever reducer",
    price: 12.75,
    unit: "Box",
    stock: 750,
    minStock: 100,
    supplier: "MediSupply",
    status: "Active",
    createdAt: "2023-01-10",
  },
];
