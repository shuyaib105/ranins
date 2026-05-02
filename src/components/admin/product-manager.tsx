"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Pencil, Trash2, ImageIcon, FolderPlus } from "lucide-react";
import Image from "next/image";
import { getPublicImageUrl } from "@/lib/utils";
import { useProductManager } from "@/hooks/use-product-manager";
import { ProductDocument } from "@/lib/queries/product.query";

export function ProductManager() {
  const {
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
  } = useProductManager();

  return (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue="products" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <TabsList className="bg-muted/50 p-1 rounded-full border border-border/50">
            <TabsTrigger value="products" className="rounded-full px-8 font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">Products</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-full px-8 font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">Categories</TabsTrigger>
          </TabsList>

          <Button onClick={() => setIsOpen(true)} className="rounded-full font-black uppercase tracking-wider">
            <Plus data-icon="inline-start" /> Add Product
          </Button>
        </div>

        <TabsContent value="products">
          <div className="rounded-[32px] border bg-card p-6 shadow-sm overflow-hidden">
            {productsLoading ? <Spinner className="mx-auto block" /> : (
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
                          {categories?.find(c => c.slug === product.category)?.name || product.category}
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
                            <Pencil className="size-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/5" 
                            onClick={() => setDeletingId(product.$id!)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="rounded-[32px] border bg-card h-fit">
              <CardHeader>
                <CardTitle className="text-xl font-black">Add New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCatSubmit} className="space-y-6">
                  <Field>
                    <FieldLabel>Category Name</FieldLabel>
                    <Input 
                      value={catFormData.name} 
                      onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="e.g. New Arrival"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Slug</FieldLabel>
                    <Input 
                      value={catFormData.slug} 
                      onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value })}
                      placeholder="e.g. new-arrival"
                      required
                    />
                  </Field>
                  <Button type="submit" disabled={createCategory.isPending} className="w-full rounded-full font-black uppercase tracking-widest">
                    {createCategory.isPending ? <Spinner className="mr-2" /> : <FolderPlus className="mr-2" />}
                    Add Category
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 rounded-[32px] border bg-card p-6 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="border-none">
                    <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground">Name</TableHead>
                    <TableHead className="font-black uppercase text-[11px] tracking-widest text-muted-foreground">Slug</TableHead>
                    <TableHead className="text-right font-black uppercase text-[11px] tracking-widest text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesLoading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-10"><Spinner className="mx-auto" /></TableCell></TableRow>
                  ) : categories?.map((cat) => (
                    <TableRow key={cat.$id} className="border-border">
                      <TableCell className="font-bold">{cat.name}</TableCell>
                      <TableCell className="font-mono text-xs">{cat.slug}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-8 rounded-full text-destructive hover:bg-destructive/5"
                          onClick={() => handleCatDelete(cat.$id!)}
                          disabled={cat.slug === 'all'}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setEditingProduct(null);
          setFormData({ name: "", price: 0, discountPrice: 0, stock: 0, category: "all", image: "" });
        }
      }}>
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
                      {categories?.map((cat) => (
                        <SelectItem key={cat.$id} value={cat.slug}>{cat.name}</SelectItem>
                      ))}
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
