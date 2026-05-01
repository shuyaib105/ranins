import { createClient } from "@/lib/client";

export interface OrderDocument {
  $id?: string;
  $createdAt?: string;
  name: string;
  phone: string;
  products: string; // JSON string of items
  totalAmount: number;
  transactionId?: string;
  paymentMethod?: "bkash" | "nagad";
  status: "pending" | "verified";
}

type OrderRow = {
  id: string;
  name: string;
  phone: string;
  products: unknown; // JSONB
  total_amount: number;
  transaction_id?: string | null;
  payment_method?: string | null;
  status: string;
  created_at: string;
};

type NewOrder = Omit<OrderDocument, "$id" | "$createdAt">;

export const orderApi = {
  list: async (status?: string): Promise<{ documents: OrderDocument[] }> => {
    const supabase = createClient();
    let query = supabase.from("orders").select("*");
        if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw error;
    const rows = data as OrderRow[] | null;
    const docs: OrderDocument[] = (rows || []).map((r) => ({
      $id: r.id,
      $createdAt: r.created_at,
      name: r.name,
      phone: r.phone,
      products: JSON.stringify(r.products),
      totalAmount: Number(r.total_amount),
      transactionId: r.transaction_id ?? undefined,
      paymentMethod: (r.payment_method === "bkash" || r.payment_method === "nagad") ? (r.payment_method as "bkash" | "nagad") : undefined,
      status: r.status as "pending" | "verified",
    }));
    return { documents: docs };
  },
  create: async (data: NewOrder) => {
    const supabase = createClient();
    const payload = {
      name: data.name,
      phone: data.phone,
      products: JSON.parse(data.products),
      total_amount: data.totalAmount,
      transaction_id: data.transactionId ?? null,
      payment_method: data.paymentMethod ?? null,
      status: data.status,
    };
    const { data: inserted, error } = await supabase.from("orders").insert([payload]).select().single();
    const ins = inserted as OrderRow;
    if (error) throw error;
    return {
      $id: ins.id,
      $createdAt: ins.created_at,
      name: ins.name,
      phone: ins.phone,
      products: JSON.stringify(ins.products),
      totalAmount: Number(ins.total_amount),
      transactionId: ins.transaction_id ?? undefined,
      paymentMethod: (ins.payment_method === "bkash" || ins.payment_method === "nagad") ? (ins.payment_method as "bkash" | "nagad") : undefined,
      status: ins.status as "pending" | "verified",
    } as OrderDocument;
  },
  updateStatus: async (id: string, status: "pending" | "verified") => {
    const supabase = createClient();
    const { data: updated, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single();
    const up = updated as OrderRow;
    if (error) throw error;
    return {
      $id: up.id,
      $createdAt: up.created_at,
      name: up.name,
      phone: up.phone,
      products: JSON.stringify(up.products),
      totalAmount: Number(up.total_amount),
      transactionId: up.transaction_id ?? undefined,
      paymentMethod: (up.payment_method === "bkash" || up.payment_method === "nagad") ? (up.payment_method as "bkash" | "nagad") : undefined,
      status: up.status as "pending" | "verified",
    } as OrderDocument;
  },
};
