"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
  whatsapp_number: z.string().nullable().optional(),
  bkash_number: z.string().nullable().optional(),
  nagad_number: z.string().nullable().optional(),
  hero_image: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  footer_text: z.string().nullable().optional(),
});

export async function updateSettingsAction(id: string, data: z.infer<typeof settingsSchema>) {
  const validated = settingsSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.message };
  }

  const supabase = await createClient();
  let query;
  if (id === "new") {
    query = supabase.from("settings").insert([validated.data]);
  } else {
    query = supabase.from("settings").update(validated.data).eq("id", id);
  }
  
  const { error } = await query;
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}


