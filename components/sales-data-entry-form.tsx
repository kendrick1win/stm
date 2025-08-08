"use client";

import { useState } from "react";
import { SalesEntry } from "@/lib/store";
import { supabase } from "@/lib/supabase/client";
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

interface Props {
  onEntryAdded?: () => void;
}

export default function SalesDataEntryForm({ onEntryAdded }: Props) {
  const [formData, setFormData] = useState<Partial<SalesEntry>>({
    status: "Pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Check authentication status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Authentication status:', { user: user?.id, email: user?.email, authError });
      
      if (!user) {
        console.warn('No authenticated user found - this might cause RLS policy violations');
      }
      // Calculate derived fields
      const totalRevenue = (formData.quantity || 0) * (formData.unit_price || 0);
      const discountAmount = totalRevenue * ((formData.discount_percent || 0) / 100);
      const netRevenue = totalRevenue - discountAmount;
      const accountsReceivable = netRevenue - (formData.payment_received || 0);
      
      const salesEntry = {
        ...formData,
        total_revenue: totalRevenue,
        discount_amount: discountAmount,
        net_revenue: netRevenue,
        accounts_receivable: accountsReceivable,
      };
      
      const { error } = await supabase
        .from('sales-entry')
        .insert([salesEntry])
        .select();
      
      if (error) throw error;
      
      alert('Sales entry saved successfully!');
      
      // Reset form
      setFormData({ status: "Pending" });
      
      // Notify parent component
      onEntryAdded?.();
    } catch (error: any) {
      console.error('Error saving sales entry:', error);
      console.error('Error details:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        stack: error?.stack
      });
      
      let errorMessage = 'Failed to save sales entry: ';
      if (error?.message?.includes('row-level security policy')) {
        errorMessage += 'Permission denied. This might be due to authentication or RLS policy issues.';
        console.error('RLS Policy Error - Check if user is authenticated and has proper permissions');
      } else {
        errorMessage += error?.message || 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="invoice_num">Invoice Number</Label>
          <Input
            id="invoice_num"
            type="number"
            value={formData.invoice_num || ""}
            onChange={(e) =>
              setFormData({ ...formData, invoice_num: Number(e.target.value) })
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
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit || ""}
            onChange={(e) =>
              setFormData({ ...formData, unit: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_price">Unit Price</Label>
          <Input
            id="unit_price"
            type="number"
            step="0.01"
            value={formData.unit_price || ""}
            onChange={(e) =>
              setFormData({ ...formData, unit_price: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenue_category">Revenue Category</Label>
          <Select
            value={formData.revenue_category || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, revenue_category: value })
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
          <Label htmlFor="revenue_type">Revenue Type</Label>
          <Select
            value={formData.revenue_type || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, revenue_type: value })
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="discount_percent">Discount %</Label>
          <Input
            id="discount_percent"
            type="number"
            min="0"
            max="100"
            value={formData.discount_percent || ""}
            onChange={(e) =>
              setFormData({ ...formData, discount_percent: Number(e.target.value) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_received">Payment Received</Label>
          <Input
            id="payment_received"
            type="number"
            step="0.01"
            value={formData.payment_received || ""}
            onChange={(e) =>
              setFormData({ ...formData, payment_received: Number(e.target.value) })
            }
          />
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

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={formData.notes || ""}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
  );
} 