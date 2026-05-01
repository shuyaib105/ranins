import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi, SettingsDocument } from "@/lib/api/settings";
import { queryKeys } from "./query-keys";

type NewSettings = Omit<SettingsDocument, "$id" | "$createdAt">;

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: async () => {
      const response = await settingsApi.get();
      return (response.documents && response.documents[0]) || null;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NewSettings> }) => {
      if (id === "new") {
        return await settingsApi.create(data as NewSettings);
      }
      return await settingsApi.update(id, data as Partial<NewSettings>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}
