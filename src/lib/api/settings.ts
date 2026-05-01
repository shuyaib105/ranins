import { createClient } from "@/lib/client";

export interface SettingsDocument {
  $id?: string;
  $createdAt?: string;
  whatsappNumber?: string;
  bkashNumber?: string;
  nagadNumber?: string;
  heroImage?: string;
  logo?: string;
  footerText?: string;
}

type SettingsRow = {
  id: string;
  whatsapp_number?: string | null;
  bkash_number?: string | null;
  nagad_number?: string | null;
  hero_image?: string | null;
  logo?: string | null;
  footer_text?: string | null;
  created_at: string;
};

type NewSettings = Omit<SettingsDocument, "$id" | "$createdAt">;

export const settingsApi = {
  get: async (): Promise<{ documents: SettingsDocument[] }> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("settings").select("*");
    if (error) throw error;
    const rows = data as SettingsRow[] | null;
    const docs: SettingsDocument[] = (rows || []).map((r) => ({
      $id: r.id,
      $createdAt: r.created_at,
      whatsappNumber: r.whatsapp_number ?? undefined,
      bkashNumber: r.bkash_number ?? undefined,
      nagadNumber: r.nagad_number ?? undefined,
      heroImage: r.hero_image ?? undefined,
      logo: r.logo ?? undefined,
      footerText: r.footer_text ?? undefined,
    }));
    return { documents: docs };
  },
  update: async (id: string, data_: Partial<NewSettings>) => {
    const supabase = createClient();
    const payload: Partial<SettingsRow> = {};
    if (data_.whatsappNumber !== undefined) payload.whatsapp_number = data_.whatsappNumber;
    if (data_.bkashNumber !== undefined) payload.bkash_number = data_.bkashNumber;
    if (data_.nagadNumber !== undefined) payload.nagad_number = data_.nagadNumber;
    if (data_.heroImage !== undefined) payload.hero_image = data_.heroImage;
    if (data_.logo !== undefined) payload.logo = data_.logo;
    if (data_.footerText !== undefined) payload.footer_text = data_.footerText;
    const { data: updated, error } = await supabase.from("settings").update(payload).eq("id", id).select().single();
    const up = updated as SettingsRow;
    if (error) throw error;
    return {
      $id: up.id,
      $createdAt: up.created_at,
      whatsappNumber: up.whatsapp_number ?? undefined,
      bkashNumber: up.bkash_number ?? undefined,
      nagadNumber: up.nagad_number ?? undefined,
      heroImage: up.hero_image ?? undefined,
      logo: up.logo ?? undefined,
      footerText: up.footer_text ?? undefined,
    } as SettingsDocument;
  },
  create: async (data_: NewSettings) => {
    const supabase = createClient();
    const payload: Partial<SettingsRow> = {
      whatsapp_number: data_.whatsappNumber ?? null,
      bkash_number: data_.bkashNumber ?? null,
      nagad_number: data_.nagadNumber ?? null,
      hero_image: data_.heroImage ?? null,
      logo: data_.logo ?? null,
      footer_text: data_.footerText ?? null,
    };
    const { data: inserted, error } = await supabase.from("settings").insert([payload]).select().single();
    const ins = inserted as SettingsRow;
    if (error) throw error;
    return {
      $id: ins.id,
      $createdAt: ins.created_at,
      whatsappNumber: ins.whatsapp_number ?? undefined,
      bkashNumber: ins.bkash_number ?? undefined,
      nagadNumber: ins.nagad_number ?? undefined,
      heroImage: ins.hero_image ?? undefined,
      logo: ins.logo ?? undefined,
      footerText: ins.footer_text ?? undefined,
    } as SettingsDocument;
  },
};
