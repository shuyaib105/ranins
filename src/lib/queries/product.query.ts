import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, ProductDocument } from "@/lib/api/product";
import { queryKeys } from "./query-keys";
import { createProductAction, updateProductAction, deleteProductAction } from "@/app/actions/product";

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
      const result = await createProductAction({
        name: data.name,
        price: data.price,
        discount_price: data.discountPrice || null,
        stock: data.stock,
        category: data.category,
        image: data.image || null,
      });
      if (result.error) throw new Error(result.error);
      return result;
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
      const payload: Partial<NewProduct> & { discount_price?: number | null } = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.price !== undefined) payload.price = data.price;
      if (data.discountPrice !== undefined) payload.discount_price = data.discountPrice;
      if (data.stock !== undefined) payload.stock = data.stock;
      if (data.category !== undefined) payload.category = data.category;
      if (data.image !== undefined) payload.image = data.image;

      const result = await updateProductAction(id, payload);

      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProductAction(id);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  return { createProduct, updateProduct, deleteProduct };
}

