"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  discount_price: z.number().nullable().optional(),
  stock: z.number().int().min(0),
  category: z.string().min(1),
  image: z.string().nullable().optional(),
});

export async function createProductAction(data: z.infer<typeof productSchema>) {
  const validated = productSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert([validated.data]);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

export async function updateProductAction(id: string, data: Partial<z.infer<typeof productSchema>>) {
  const validated = productSchema.partial().safeParse(data);
  if (!validated.success) {
    return { error: validated.error.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(validated.data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}


export async function deleteProductAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

