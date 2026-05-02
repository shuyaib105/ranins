"use client";

import { useOrders, useUpdateOrderStatus, OrderDocument } from "@/lib/queries/order.query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, Phone, Hash } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export function OrderManager() {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleVerify = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: "verified" });
      toast.success("Order verified");
    } catch (_error) {
      toast.error("Failed to verify order");
    }
  };


  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-black">Orders History</h2>
      
      <div className="rounded-[32px] border bg-card p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground whitespace-nowrap">Date</TableHead>
                <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground whitespace-nowrap">Customer</TableHead>
                <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground whitespace-nowrap">Products</TableHead>
                <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground text-right whitespace-nowrap">Total</TableHead>
                <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground whitespace-nowrap">Payment</TableHead>
                <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground whitespace-nowrap">Status</TableHead>
                <TableHead className="text-right font-black uppercase text-[11px] tracking-widest text-muted-foreground whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order: OrderDocument) => {
                const items = JSON.parse(order.products) as Array<{ qty: number; name: string }>;
                return (
                  <TableRow key={order.$id} className="border-border group">
                    <TableCell className="text-[12px] text-muted-foreground font-bold whitespace-nowrap">
                      {order.$createdAt ? format(new Date(order.$createdAt), "MMM d, h:mm a") : ""}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="font-bold">{order.name}</div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Phone className="size-3" /> {order.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate text-[12px]">
                        {items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold whitespace-nowrap">
                      ৳ {order.totalAmount}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {order.paymentMethod ? (
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="rounded-full bg-pink-500/10 text-pink-600 border-pink-500/20 font-black uppercase text-[9px] w-fit">
                            {order.paymentMethod}
                          </Badge>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Hash className="size-3" /> {order.transactionId}
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="rounded-full bg-green-500/10 text-green-600 border-green-500/20 font-black uppercase text-[9px] w-fit">
                          WhatsApp
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
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
                    <TableCell className="text-right whitespace-nowrap">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleVerify(order.$id!)}
                          className="rounded-full font-black uppercase text-[10px] bg-primary hover:bg-primary/90"
                        >
                          <CheckCircle2 data-icon="inline-start" />
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
    </div>
  );
}
