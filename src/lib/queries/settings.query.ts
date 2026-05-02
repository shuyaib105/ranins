import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi, SettingsDocument } from "@/lib/api/settings";
import { queryKeys } from "./query-keys";
import { updateSettingsAction } from "@/app/actions/settings";

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
      const payload: Record<string, string | null | undefined> = {};
      if (data.whatsappNumber !== undefined) payload.whatsapp_number = data.whatsappNumber;
      if (data.bkashNumber !== undefined) payload.bkash_number = data.bkashNumber;
      if (data.nagadNumber !== undefined) payload.nagad_number = data.nagadNumber;
      if (data.heroImage !== undefined) payload.hero_image = data.heroImage;
      if (data.logo !== undefined) payload.logo = data.logo;
      if (data.footerText !== undefined) payload.footer_text = data.footerText;

      const result = await updateSettingsAction(id, payload);

      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}

