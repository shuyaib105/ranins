"use client";

import { useOrders, useUpdateOrderStatus, OrderDocument } from "@/lib/queries/order.query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Phone, Hash } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export function OrderManager() {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleVerify = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: "verified" });
      toast.success("Order verified");
    } catch (error) {
      toast.error("Failed to verify order");
    }
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black">Orders History</h2>
      
      <div className="rounded-[32px] border bg-white p-6 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-gray-400">Date</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-gray-400">Customer</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-gray-400">Products</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-gray-400 text-right">Total</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-gray-400">Payment</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-gray-400">Status</TableHead>
              <TableHead className="text-right font-black uppercase text-[11px] tracking-widest text-gray-400">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order: OrderDocument) => {
              const items = JSON.parse(order.products) as Array<{ qty: number; name: string }>;
              return (
                <TableRow key={order.$id} className="border-gray-50 group">
                  <TableCell className="text-[12px] text-gray-500 font-bold">
                    {order.$createdAt ? format(new Date(order.$createdAt), "MMM d, h:mm a") : ""}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">{order.name}</div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Phone className="h-3 w-3" /> {order.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate text-[12px]">
                      {items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ৳ {order.totalAmount}
                  </TableCell>
                  <TableCell>
                    {order.paymentMethod ? (
                      <div className="space-y-1">
                        <Badge variant="outline" className="rounded-full bg-pink-50 text-pink-600 border-pink-100 font-black uppercase text-[9px]">
                          {order.paymentMethod}
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Hash className="h-3 w-3" /> {order.transactionId}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="rounded-full bg-green-50 text-green-600 border-green-100 font-black uppercase text-[9px]">
                        WhatsApp
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.status === "verified" ? (
                      <Badge className="rounded-full bg-blue-500 text-white border-none font-black uppercase text-[9px]">
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="rounded-full bg-yellow-400 text-white border-none font-black uppercase text-[9px]">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleVerify(order.$id!)}
                        className="rounded-full h-8 px-4 font-black uppercase text-[10px] bg-black hover:bg-gray-800"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Verify
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
