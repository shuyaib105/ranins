"use client";

import { useState } from "react";
import { useProducts, useAdminMutations, ProductDocument, NewProduct } from "@/lib/queries/product.query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/client";
import Image from "next/image";
import { getPublicImageUrl, deleteStorageImage } from "@/lib/utils";

export function ProductManager() {
  const { data: products, isLoading } = useProducts();
  const { createProduct, updateProduct, deleteProduct } = useAdminMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDocument | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<NewProduct>({
    name: "",
    price: 0,
    discountPrice: 0,
    stock: 0,
    category: "all",
    image: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleEdit = (product: ProductDocument) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stock: product.stock,
      category: product.category,
      image: product.image ?? "",
    });
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      // Find the product first to get its image URL
      const product = products?.find((p) => p.$id === deletingId);
      
      await deleteProduct.mutateAsync(deletingId);
      
      // If product has an image, delete it from storage
      if (product?.image) {
        const supabase = createClient();
        await deleteStorageImage(supabase, product.image);
      }
      
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!;
      const filePath = `${crypto.randomUUID()}_${file.name.replace(/\s+/g, "_")}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file as File, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        if (uploadError.message === "Bucket not found") {
          toast.error("Storage bucket 'images' not found. Please run the provided SQL in Supabase dashboard.");
        } else {
          toast.error(`Upload failed: ${uploadError.message}`);
        }
        throw uploadError;
      }
      
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
      
      // Clean up old image if editing and replacing image
      if (editingProduct?.image) {
        await deleteStorageImage(supabase, editingProduct.image);
      }
      
      setFormData((prev) => ({ ...prev, image: publicData.publicUrl }));
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Upload error:", error);
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
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Inventory</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setEditingProduct(null);
            setFormData({ name: "", price: 0, discountPrice: 0, stock: 0, category: "all", image: "" });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-full font-black uppercase tracking-wider">
              <Plus data-icon="inline-start" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-[32px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">
                {editingProduct ? "Edit Product" : "New Product"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter the product details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <FieldGroup className="mt-4 gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel htmlFor="name">Product Name</FieldLabel>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g. Premium White Tee"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="category">Category</FieldLabel>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData({ ...formData, category: val })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Exclusive</SelectItem>
                        <SelectItem value="islamic">Islamic</SelectItem>
                        <SelectItem value="motivational">Motivational</SelectItem>
                        <SelectItem value="classical">Classical</SelectItem>
                        <SelectItem value="musicband">Music Band</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Field>
                    <FieldLabel htmlFor="price">Price (৳)</FieldLabel>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="discountPrice">Discount Price (Optional)</FieldLabel>
                    <Input
                      id="discountPrice"
                      type="number"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="stock">Stock Quantity</FieldLabel>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="image">Product Image</FieldLabel>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative flex size-32 items-center justify-center rounded-[24px] border-2 border-dashed border-border bg-muted overflow-hidden shrink-0">
                      {formData.image ? (
                        <Image src={getPublicImageUrl(formData.image)} alt="Preview" fill className="object-cover" />
                      ) : (
                        <ImageIcon className="size-10 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image-file")?.click()}
                        className="rounded-full font-bold w-full sm:w-auto"
                        disabled={uploading}
                      >
                        {uploading && <Spinner className="mr-2" data-icon="inline-start" />}
                        {uploading ? "Uploading..." : "Upload New Image"}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center sm:text-left">Recommended: 800x1000px, JPG/PNG</p>
                    </div>
                  </div>
                </Field>
              </FieldGroup>
              <DialogFooter className="mt-10">
                <Button type="submit" className="w-full rounded-full py-6 font-black uppercase tracking-widest shadow-xl">
                  {editingProduct ? "Save Changes" : "Publish Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-[32px] border bg-card p-6 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="w-[100px] font-black uppercase text-[11px] tracking-widest text-muted-foreground">Image</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground">Product</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground">Category</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground text-right">Price</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground text-right">Stock</TableHead>
              <TableHead className="w-[100px] text-right font-black uppercase text-[11px] tracking-widest text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product: ProductDocument) => (
              <TableRow key={product.$id} className="border-border group">
                <TableCell>
                  <div className="relative h-16 w-12 overflow-hidden rounded-xl">
                    {product.image ? (
                      <Image src={getPublicImageUrl(product.image)} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <ImageIcon className="size-5 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold">{product.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">#{product.$id}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold">
                  ৳ {product.price}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-black ${product.stock < 10 ? "text-destructive" : "text-foreground"}`}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => handleEdit(product)}>
                      <Pencil />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/5" 
                      onClick={() => setDeletingId(product.$id!)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from the catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
