"use client";

import { useState } from "react";
import { useProducts, useAdminMutations, ProductDocument, NewProduct } from "@/lib/queries/product.query";
import { useCategories, useCategoryMutations } from "@/lib/queries/category.query";
import { toast } from "sonner";
import { createClient } from "@/lib/client";
import { deleteStorageImage } from "@/lib/utils";
import { uploadOptimizedImage } from "@/lib/api/upload";

export function useProductManager() {
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { createProduct, updateProduct, deleteProduct } = useAdminMutations();
  const { createCategory, deleteCategory } = useCategoryMutations();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDocument | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<string>("all");

  const [formData, setFormData] = useState<NewProduct>({
    name: "",
    price: 0,
    discountPrice: 0,
    stock: 0,
    category: "all",
    image: "",
    isHidden: false,
  });

  const [catFormData, setCatFormData] = useState({ name: "", slug: "" });
  const [uploading, setUploading] = useState(false);

  const products = allProducts?.filter(p => 
    adminCategoryFilter === "all" || p.category === adminCategoryFilter
  );

  const handleEdit = (product: ProductDocument) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stock: product.stock,
      category: product.category,
      image: product.image ?? "",
      isHidden: product.isHidden ?? false,
    });
    setIsOpen(true);
  };

  const toggleVisibility = async (product: ProductDocument) => {
    try {
      await updateProduct.mutateAsync({ 
        id: product.$id!, 
        data: { isHidden: !product.isHidden } 
      });
      toast.success(product.isHidden ? "Product visible" : "Product hidden");
    } catch (_error) {
      toast.error("Failed to update visibility");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const product = products?.find((p) => p.$id === deletingId);
      await deleteProduct.mutateAsync(deletingId);
      if (product?.image) {
        const supabase = createClient();
        await deleteStorageImage(supabase, product.image);
      }
      toast.success("Product deleted");
    } catch (_error) {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory.mutateAsync(catFormData);
      toast.success("Category added");
      setCatFormData({ name: "", slug: "" });
    } catch (_error) {
      toast.error("Failed to add category");
    }
  };

  const handleCatDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch (_error) {
      toast.error("Failed to delete category");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const { publicUrl } = await uploadOptimizedImage(supabase, file, "product");

      if (editingProduct?.image) {
        await deleteStorageImage(supabase, editingProduct.image);
      }

      setFormData((prev) => ({ ...prev, image: publicUrl }));
      toast.success("Image optimized and uploaded");
    } catch (error: unknown) {
      console.error("Upload error:", error);
      const err = error as { message?: string };
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.$id!, data: formData });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(formData);
        toast.success("Product created");
      }
      setIsOpen(false);
      setEditingProduct(null);
      setFormData({ name: "", price: 0, discountPrice: 0, stock: 0, category: "all", image: "" });
    } catch (_error) {
      toast.error("Failed to save product");
    }
  };

  return {
    products,
    productsLoading,
    categories,
    categoriesLoading,
    isOpen,
    setIsOpen,
    editingProduct,
    setEditingProduct,
    deletingId,
    setDeletingId,
    formData,
    setFormData,
    catFormData,
    setCatFormData,
    uploading,
    handleEdit,
    handleDelete,
    handleCatSubmit,
    handleCatDelete,
    handleFileUpload,
    handleSubmit,
    createCategory,
    adminCategoryFilter,
    setAdminCategoryFilter,
    toggleVisibility,
  };
}
