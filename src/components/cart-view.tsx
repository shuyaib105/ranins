"use client";

import { ChevronLeft, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { CartItem } from "@/types/product";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckoutForm } from "./checkout-form";
import { useCreateOrder } from "@/lib/queries/order.query";
import { useSettings } from "@/lib/queries/settings.query";
import { getPublicImageUrl } from "@/lib/utils";

interface CartViewProps {
  cart: CartItem[];
  onBack: () => void;
  onUpdateQty: (id: string | number, delta: number) => void;
  onRemove: (id: string | number) => void;
  totalAmount: number;
}

const catNames: Record<string, string> = {
  all: "All Collection",
  islamic: "Islamic Content",
  motivational: "Motivational Content",
  classical: "Classical Content",
  musicband: "Music Band Content",
};

export function CartView({
  cart,
  onBack,
  onUpdateQty,
  onRemove,
  totalAmount,
}: CartViewProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const { data: settings } = useSettings();
  const waNumber = settings?.whatsappNumber || "8801918318094";
  const createOrder = useCreateOrder();

  const handleWAOrder = async () => {
    // Save to Appwrite for tracking
    try {
      await createOrder.mutateAsync({
        name: "WhatsApp Customer",
        phone: "WhatsApp",
        products: JSON.stringify(cart),
        totalAmount,
        status: "pending",
      });
    } catch (e) {
      console.error("Failed to track order", e);
    }

    const list = cart
      .map(
        (i) =>
          `• [${i.id}] ${i.name} — ${catNames[i.cat] || i.cat} — ${i.qty} pcs`
      )
      .join("\n");
    const msg = `Order List:\n\n${list}\n\n💵 Total Bill: ৳ ${totalAmount}\n\nPlease confirm my order.`;
    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-10 min-h-screen animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-12 flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full bg-muted shadow-sm hover:bg-muted/80"
        >
          <ChevronLeft />
        </Button>
        <h2 className="text-3xl font-black">Your Cart</h2>
      </div>

      {cart.length === 0 ? (
        <Empty className="py-40">
          <EmptyHeader>
            <EmptyTitle className="text-xl italic text-muted-foreground">
              Your cart is currently empty...
            </EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 rounded-[32px] border border-border bg-card p-6 shadow-sm"
              >
                <div className="relative h-24 w-20 overflow-hidden rounded-[20px]">
                  <Image
                    src={getPublicImageUrl(item.img)}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-[9px] font-black text-muted-foreground">
                    #{item.id}
                  </p>
                  <h4 className="text-md font-bold text-foreground">{item.name}</h4>
                  <div className="mt-3 flex items-center gap-6">
                    <span className="text-sm font-black">৳ {item.price}</span>
                    <div className="flex items-center rounded-full bg-muted px-2 py-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-transparent"
                        onClick={() => onUpdateQty(item.id, -1)}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="px-4 text-[12px] font-black">
                        {item.qty}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-transparent"
                        onClick={() => onUpdateQty(item.id, 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground/30 hover:text-destructive hover:bg-transparent"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-border pt-10">
            <div className="mb-10 flex items-center justify-between px-4">
              <span className="text-[11px] font-black uppercase tracking-[5px] text-muted-foreground">
                Total Bill
              </span>
              <span className="text-4xl font-black">৳ {totalAmount}</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                className="w-full rounded-full bg-primary text-sm font-black uppercase tracking-[1px] text-primary-foreground shadow-2xl transition-all hover:scale-[1.03] hover:bg-primary/90 active:scale-95"
                onClick={() => setShowCheckout(true)}
              >
                <CreditCard className="mr-3" data-icon="inline-start" />
                Pay Now
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full border-2 border-[#25D366] text-sm font-black uppercase tracking-[0.5px] text-[#25D366] transition-all hover:scale-[1.03] hover:bg-[#25D366]/5 active:scale-95"
                onClick={handleWAOrder}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="mr-3 size-6 fill-current"
                  data-icon="inline-start"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.8-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.5 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
                WhatsApp Order
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-md rounded-[40px] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Complete Your Order</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please provide your details and payment information to complete the order.
            </DialogDescription>
          </DialogHeader>
          <CheckoutForm 
            cart={cart} 
            totalAmount={totalAmount} 
            onSuccess={() => {
              setShowCheckout(false);
              onBack(); // Go back to shop
              // Optionally clear cart - but cart is managed by hook, so maybe just toast and back
            }} 
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
