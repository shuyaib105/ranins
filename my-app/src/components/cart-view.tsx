"use client";

import { ChevronLeft, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/product";
import Image from "next/image";

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
  const waNumber = "8801918318094";

  const handleWAOrder = () => {
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
          className="h-12 w-12 rounded-full bg-gray-50 shadow-sm hover:bg-gray-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-3xl font-black">Your Cart</h2>
      </div>

      {cart.length === 0 ? (
        <div className="py-40 text-center">
          <p className="text-xl italic text-gray-300">
            Your cart is currently empty...
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 rounded-[32px] border border-gray-50 bg-white p-6 shadow-sm"
              >
                <div className="relative h-24 w-20 overflow-hidden rounded-[20px]">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-[9px] font-black text-gray-400">
                    #{item.id}
                  </p>
                  <h4 className="text-md font-bold text-black">{item.name}</h4>
                  <div className="mt-3 flex items-center gap-6">
                    <span className="text-sm font-black">৳ {item.price}</span>
                    <div className="flex items-center rounded-full bg-gray-50 px-2 py-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-transparent"
                        onClick={() => onUpdateQty(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 text-[12px] font-black">
                        {item.qty}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-transparent"
                        onClick={() => onUpdateQty(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-200 hover:text-red-500 hover:bg-transparent"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-gray-100 pt-10">
            <div className="mb-10 flex items-center justify-between px-4">
              <span className="text-[11px] font-black uppercase tracking-[5px] text-gray-300">
                Total Bill
              </span>
              <span className="text-4xl font-black">৳ {totalAmount}</span>
            </div>
            <Button
              className="w-full rounded-full bg-[#25D366] py-8 text-sm font-black uppercase tracking-[0.5px] text-white shadow-2xl transition-all hover:scale-[1.03] hover:bg-[#20bd5a] active:scale-95"
              onClick={handleWAOrder}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="mr-3 h-6 w-6 fill-current"
              >
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.8-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.5 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              Complete Order on WhatsApp
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
