"use client";

import { useState } from "react";
import { useProducts, useAdminMutations, ProductDocument, NewProduct } from "@/lib/queries/product.query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/client";
import Image from "next/image";

export function ProductManager() {
  const { data: products, isLoading } = useProducts();
  const { createProduct, updateProduct, deleteProduct } = useAdminMutations();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDocument | null>(null);

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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success("Product deleted");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!;
      const filePath = `${crypto.randomUUID()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file as File);
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
      setFormData((prev) => ({ ...prev, image: publicData.publicUrl }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Failed to upload image");
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

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
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
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-[32px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">
                {editingProduct ? "Edit Product" : "New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <FieldGroup className="mt-4 gap-6">
                <div className="grid grid-cols-2 gap-6">
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

                <div className="grid grid-cols-3 gap-6">
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
                  <div className="flex items-center gap-6">
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-[24px] border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
                      {formData.image ? (
                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-gray-300" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
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
                        className="rounded-full font-bold"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload New Image"}
                      </Button>
                      <p className="text-xs text-gray-400">Recommended: 800x1000px, JPG/PNG</p>
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

      <div className="rounded-[32px] border bg-white p-6 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="w-[100px] font-black uppercase text-[11px] tracking-widest text-gray-400">Image</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-gray-400">Product</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-gray-400">Category</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-gray-400 text-right">Price</TableHead>
              <TableHead className="font-black uppercase text-[11px] tracking-widest text-gray-400 text-right">Stock</TableHead>
              <TableHead className="w-[100px] text-right font-black uppercase text-[11px] tracking-widest text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product: ProductDocument) => (
              <TableRow key={product.$id} className="border-gray-50 group">
                <TableCell>
                  <div className="relative h-16 w-12 overflow-hidden rounded-xl">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold">{product.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">#{product.$id}</div>
                </TableCell>
                <TableCell>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="text-right font-bold">
                  ৳ {product.price}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-black ${product.stock < 10 ? "text-red-500" : "text-gray-900"}`}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(product.$id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
