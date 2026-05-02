import { createClient } from "@/lib/client";

export interface ProductDocument {
  $id?: string;
  $createdAt?: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  image?: string;
  isHidden?: boolean;
}

type ProductRow = {
  id: string;
  name: string;
  price: number;
  discount_price?: number | null;
  stock: number;
  category: string;
  image?: string | null;
  is_hidden: boolean;
  created_at: string;
};

type NewProduct = Omit<ProductDocument, "$id" | "$createdAt">;

export const productApi = {
  list: async (): Promise<{ documents: ProductDocument[] }> => {
    const supabase = createClient();
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    const rows = data as ProductRow[] | null;
    if (error) throw error;
    const docs: ProductDocument[] = (rows || []).map((r) => ({
      $id: r.id,
      $createdAt: r.created_at,
      name: r.name,
      price: Number(r.price),
      discountPrice: r.discount_price ?? undefined,
      stock: r.stock,
      category: r.category,
      image: r.image ?? undefined,
      isHidden: r.is_hidden,
    }));
    return { documents: docs };
  },
  create: async (data: NewProduct) => {
    const supabase = createClient();
    const payload = {
      name: data.name,
      price: data.price,
      discount_price: data.discountPrice ?? null,
      stock: data.stock,
      category: data.category,
      image: data.image ?? null,
      is_hidden: data.isHidden ?? false,
    };
    const { data: inserted, error } = await supabase.from("products").insert([payload]).select().single();
    const ins = inserted as ProductRow | null;
    if (error) throw error;
    return {
      $id: ins!.id,
      $createdAt: ins!.created_at,
      name: ins!.name,
      price: Number(ins!.price),
      discountPrice: ins!.discount_price ?? undefined,
      stock: ins!.stock,
      category: ins!.category,
      image: ins!.image ?? undefined,
      isHidden: ins!.is_hidden,
    } as ProductDocument;
  },
  update: async (id: string, data_: Partial<NewProduct>) => {
    const supabase = createClient();
    const payload: Partial<ProductRow> = {};
    if (data_.name !== undefined) payload.name = data_.name;
    if (data_.price !== undefined) payload.price = Number(data_.price);
    if (data_.discountPrice !== undefined) payload.discount_price = data_.discountPrice ?? null;
    if (data_.stock !== undefined) payload.stock = data_.stock as number;
    if (data_.category !== undefined) payload.category = data_.category;
    if (data_.image !== undefined) payload.image = data_.image ?? null;
    if (data_.isHidden !== undefined) payload.is_hidden = data_.isHidden;
    const { data: updated, error } = await supabase.from("products").update(payload).eq("id", id).select().single();
    const up = updated as ProductRow;
    if (error) throw error;
    return {
      $id: up.id,
      $createdAt: up.created_at,
      name: up.name,
      price: Number(up.price),
      discountPrice: up.discount_price ?? undefined,
      stock: up.stock,
      category: up.category,
      image: up.image ?? undefined,
      isHidden: up.is_hidden,
    } as ProductDocument;
  },
  delete: async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  },
};
