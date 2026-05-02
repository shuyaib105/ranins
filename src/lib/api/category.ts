import { createClient } from "@/lib/client";

export interface CategoryDocument {
  $id?: string;
  name: string;
  slug: string;
  $createdAt?: string;
}

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export const categoryApi = {
  list: async (): Promise<CategoryDocument[]> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) throw error;
    const rows = data as CategoryRow[];
    return rows.map((r) => ({
      $id: r.id,
      name: r.name,
      slug: r.slug,
      $createdAt: r.created_at,
    }));
  },
  create: async (data: Omit<CategoryDocument, "$id" | "$createdAt">) => {
    const supabase = createClient();
    const { data: inserted, error } = await supabase.from("categories").insert([data]).select().single();
    if (error) throw error;
    const ins = inserted as CategoryRow;
    return {
      $id: ins.id,
      name: ins.name,
      slug: ins.slug,
      $createdAt: ins.created_at,
    } as CategoryDocument;
  },
  delete: async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
  },
};
