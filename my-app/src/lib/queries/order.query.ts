import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi, OrderDocument } from "@/lib/api/order";
import { queryKeys } from "./query-keys";

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
      return await orderApi.create(data);
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
      return await orderApi.updateStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
