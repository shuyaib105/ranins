"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export async function createCategoryAction(data: z.infer<typeof categorySchema>) {
  const validated = categorySchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert([validated.data]);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}


export async function deleteCategoryAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

