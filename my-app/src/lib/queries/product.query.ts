import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, ProductDocument } from "@/lib/api/product";
import { queryKeys } from "./query-keys";

export type { ProductDocument };

export type NewProduct = Omit<ProductDocument, "$id" | "$createdAt">;

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: async () => {
      const response = await productApi.list();
      return response.documents || [] as ProductDocument[];
    },
  });
}

export function useAdminMutations() {
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (data: NewProduct) => {
      return await productApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<NewProduct>;
    }) => {
      return await productApi.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      return await productApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  return { createProduct, updateProduct, deleteProduct };
}
