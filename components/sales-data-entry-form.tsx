"use client";

import { useState } from "react";
import { SalesEntry } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SalesDataEntryForm() {
  const [formData, setFormData] = useState<Partial<SalesEntry>>({
    status: "Pending",
    paymentStatus: "Pending",
    remainingBalance: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would add your Supabase insert/update logic
    // Example:
    // const { data, error } = await supabase
    //   .from('sales')
    //   .insert([formData])
    
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="invoiceNo">Invoice Number</Label>
          <Input
            id="invoiceNo"
            value={formData.invoiceNo || ""}
            onChange={(e) =>
              setFormData({ ...formData, invoiceNo: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date || ""}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer">Customer</Label>
          <Input
            id="customer"
            value={formData.customer || ""}
            onChange={(e) =>
              setFormData({ ...formData, customer: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product">Product</Label>
          <Input
            id="product"
            value={formData.product || ""}
            onChange={(e) =>
              setFormData({ ...formData, product: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity || ""}
            onChange={(e) =>
              setFormData({ ...formData, quantity: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenueCategory">Revenue Category</Label>
          <Select
            value={formData.revenueCategory || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, revenueCategory: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Prescription">Prescription</SelectItem>
              <SelectItem value="OTC">OTC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenueType">Revenue Type</Label>
          <Select
            value={formData.revenueType || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, revenueType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Direct">Direct</SelectItem>
              <SelectItem value="Wholesale">Wholesale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Save Entry</Button>
      </div>
    </form>
  );
} 