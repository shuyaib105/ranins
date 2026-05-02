"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const orderSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  products: z.array(z.any()),
  total_amount: z.number().min(0),
  transaction_id: z.string().nullable().optional(),
  payment_method: z.string().nullable().optional(),
  status: z.enum(["pending", "verified"]),
});

export async function updateOrderStatusAction(id: string, status: "pending" | "verified") {
  const validated = z.enum(["pending", "verified"]).safeParse(status);
  if (!validated.success) {
    return { error: "Invalid status" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status: validated.data }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}

export async function createOrderAction(data: z.infer<typeof orderSchema>) {
  const validated = orderSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("orders").insert([validated.data]);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true };
}


