"use client";

import { useState } from "react";
import { useCreateOrder } from "@/lib/queries/order.query";
import { useSettings } from "@/lib/queries/settings.query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { CartItem } from "@/types/product";

interface CheckoutFormProps {
  cart: CartItem[];
  totalAmount: number;
  onSuccess: () => void;
}

export function CheckoutForm({ cart, totalAmount, onSuccess }: CheckoutFormProps) {
  const createOrder = useCreateOrder();
  const { data: settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    paymentMethod: "bkash" as "bkash" | "nagad",
    transactionId: "",
  });

  const paymentNumber = formData.paymentMethod === "bkash" 
    ? settings?.bkashNumber || "01918318094" 
    : settings?.nagadNumber || "01918318094";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.transactionId) {
      toast.error("Please provide a transaction ID");
      return;
    }

    setLoading(true);
    try {
      await createOrder.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        products: JSON.stringify(cart),
        totalAmount,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        status: "pending",
      });
      toast.success("Order placed successfully! We will verify it soon.");
      onSuccess();
    } catch (err: unknown) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="rounded-[24px] bg-muted p-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Payable</p>
        <h3 className="text-3xl font-black">৳ {totalAmount}</h3>
      </div>

      <FieldGroup className="gap-6">
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="rounded-2xl"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input
            id="phone"
            type="tel"
            placeholder="017XXXXXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="rounded-2xl"
          />
        </Field>

        <Field>
          <FieldLabel>Payment Method</FieldLabel>
          <ToggleGroup
            type="single"
            value={formData.paymentMethod}
            onValueChange={(val: string | null) => val && setFormData({ ...formData, paymentMethod: val as "bkash" | "nagad" })}
            className="justify-start gap-4"
          >
            <ToggleGroupItem
              value="bkash"
              className="flex-1 rounded-2xl border-2 py-8 font-black data-[state=on]:border-[#d2358d] data-[state=on]:bg-[#d2358d]/5 data-[state=on]:text-[#d2358d]"
            >
              bKash
            </ToggleGroupItem>
            <ToggleGroupItem
              value="nagad"
              className="flex-1 rounded-2xl border-2 py-8 font-black data-[state=on]:border-[#f7941d] data-[state=on]:bg-[#f7941d]/5 data-[state=on]:text-[#f7941d]"
            >
              Nagad
            </ToggleGroupItem>
          </ToggleGroup>
          <FieldDescription className="mt-2 text-center text-[11px] font-medium leading-relaxed">
            Send ৳ {totalAmount} to <span className="font-bold text-foreground">{paymentNumber}</span> (Personal) 
            and enter the Transaction ID below.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="trx">Transaction ID</FieldLabel>
          <Input
            id="trx"
            placeholder="TRX123456789"
            value={formData.transactionId}
            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
            required
            className="rounded-2xl border-2 border-border focus-visible:border-primary"
          />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full py-8 text-sm font-black uppercase tracking-[2px] shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
      >
        {loading && <Spinner className="mr-2" data-icon="inline-start" />}
        {loading ? "Processing..." : "Confirm Payment"}
      </Button>
    </form>
  );
}
