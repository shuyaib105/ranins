import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi, OrderDocument } from "@/lib/api/order";
import { queryKeys } from "./query-keys";
import { createOrderAction, updateOrderStatusAction } from "@/app/actions/order";

export type { OrderDocument };

type NewOrder = Omit<OrderDocument, "$id" | "$createdAt">;

export function useOrders(status?: string) {
  return useQuery({
    queryKey: queryKeys.orders.list(status),
    queryFn: async () => {
      const response = await orderApi.list(status);
      return response.documents;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewOrder) => {
      const payload = {
        name: data.name,
        phone: data.phone,
        products: JSON.parse(data.products),
        total_amount: data.totalAmount,
        transaction_id: data.transactionId ?? null,
        payment_method: data.paymentMethod ?? null,
        status: data.status,
      };
      const result = await createOrderAction(payload);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "verified" }) => {
      const result = await updateOrderStatusAction(id, status);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

