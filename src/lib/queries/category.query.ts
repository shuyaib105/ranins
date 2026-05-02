import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi, CategoryDocument } from "@/lib/api/category";
import { queryKeys } from "./query-keys";
import { createCategoryAction, deleteCategoryAction } from "@/app/actions/category";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryApi.list(),
  });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: async (data: Omit<CategoryDocument, "$id" | "$createdAt">) => {
      const result = await createCategoryAction(data);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCategoryAction(id);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  return { createCategory, deleteCategory };
}

