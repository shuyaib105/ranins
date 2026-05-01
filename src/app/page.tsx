"use client";

import { useState, useEffect, useMemo } from "react";
import { Product, Category } from "@/types/product";
import { ProductDocument } from "@/lib/queries/product.query";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { CartView } from "@/components/cart-view";
import { Footer } from "@/components/footer";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useProducts } from "@/lib/queries/product.query";
import { useSettings } from "@/lib/queries/settings.query";

const catNames: Record<string, string> = {
  all: "Exclusive Collection",
  islamic: "Islamic Content",
  motivational: "Motivational Content",
  classical: "Classical Content",
  musicband: "Music Band Content",
};

export default function Home() {
  const { data: appwriteProducts, isLoading: loading } = useProducts();
  const { data: settings } = useSettings();
  const [currentView, setCurrentView] = useState<"shop" | "cart">("shop");
  const [currentFilter, setCurrentFilter] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const { cart, addToCart, removeFromCart, updateQty, cartCount, totalAmount } =
    useCart();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const [now] = useState(() => Date.now());

  const products: Product[] = (appwriteProducts || []).map((p: ProductDocument) => ({
    id: p.$id!,
    name: p.name,
    originalPrice: p.discountPrice ? p.price : 0,
    price: p.discountPrice || p.price,
    cat: (p.category as Category) || "all",
    isNew: mounted ? (p.$createdAt ? new Date(p.$createdAt).getTime() > now - 7 * 24 * 60 * 60 * 1000 : false) : false,
    img: p.image ?? "",
  })) || [];

  const filteredProducts = products.filter((p) => {
    const matchCat = currentFilter === "all" || p.cat === currentFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleQuickBuy = (product: Product) => {
    const waNumber = settings?.whatsappNumber || "8801918318094";
    const msg = `Hi! I want to know more about this product:\n\n🛍️ Product: ${product.name}\n💰 Price: ৳ ${product.price}`;
    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success("Added to bag");
  };

  if (currentView === "cart") {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground">
        <CartView
          cart={cart}
          onBack={() => setCurrentView("shop")}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          totalAmount={totalAmount}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar
        cartCount={cartCount}
        onSearch={setSearchQuery}
        onCategorySelect={(cat) => {
          setCurrentFilter(cat);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onCartClick={() => setCurrentView("cart")}
      />

      <main className="container mx-auto px-4 py-8">
        <section className="mx-auto mb-12 max-w-2xl text-center px-4">
          <h2 className="mb-4 text-fluid-3xl font-black tracking-tight">
            Welcome to Ranins!
          </h2>
          <p className="text-fluid-sm leading-relaxed text-muted-foreground">
            Looking for high-quality, 100% cotton t-shirts that are budget-friendly? 
            We&apos;ve got you covered! We aim to bring stylish and comfortable t-shirts 
            to everyone, without breaking the bank. Premium quality, affordable prices. 
            Shop now and express yourself!
          </p>
        </section>

        <Hero />

        <section className="mx-auto mb-8 max-w-2xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              className={`h-auto rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-[1.5px] transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[2px] ${
                currentFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-[0_6px_20px_rgba(0,0,0,0.15)] -translate-y-[2px]"
                  : "bg-transparent text-muted-foreground border-2 border-border hover:border-primary hover:text-foreground hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              }`}
              onClick={() => setCurrentFilter("all")}
            >
              New Drop
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`h-auto rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-[1.5px] transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[2px] ${
                    currentFilter !== "all"
                      ? "bg-primary text-primary-foreground shadow-[0_6px_20px_rgba(0,0,0,0.15)] -translate-y-[2px]"
                      : "bg-transparent text-muted-foreground border-2 border-border hover:border-primary hover:text-foreground hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 rounded-2xl p-2 shadow-2xl">
                {Object.entries(catNames).map(([id, name]) => (
                  <DropdownMenuItem
                    key={id}
                    className="cursor-pointer rounded-xl px-5 py-3.5 text-[13px] font-bold transition-all hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setCurrentFilter(id as Category)}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative">
              <Button
                variant="outline"
                className="h-auto rounded-full border-2 border-border bg-transparent px-6 py-3 text-[10px] font-black uppercase tracking-[1.5px] text-muted-foreground opacity-60 cursor-not-allowed sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[2px]"
              >
                Customize T-Shirt
              </Button>
              <Badge 
                className="absolute -top-2 -right-2 z-10 animate-pulse rounded-full border-[1.5px] border-destructive bg-destructive text-[7px] font-900 uppercase tracking-[1px] text-destructive-foreground"
              >
                Coming Soon
              </Badge>
            </div>
          </div>
        </section>

        <h2 className="mb-8 border-l-8 border-primary pl-4 text-xl font-bold">
          {catNames[currentFilter] || "Collection"}
        </h2>


        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner className="size-10" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onQuickBuy={handleQuickBuy}
                onImageClick={setSelectedImg}
                showCategory={currentFilter === "all"}
              />
            ))}
            {filteredProducts.length === 0 && (
              <Empty className="col-span-full py-20">
                <EmptyHeader>
                  <EmptyTitle>No products found</EmptyTitle>
                  <EmptyDescription>
                    We couldn&apos;t find any products matching your search.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        )}
      </main>

      <Footer />

      <Dialog open={!!selectedImg} onOpenChange={() => setSelectedImg(null)}>
        <DialogContent className="max-w-[90vw] border-none bg-transparent p-0 shadow-none outline-none">
          <DialogTitle className="sr-only">Product Image Preview</DialogTitle>
          <DialogDescription className="sr-only">
            Enlarged view of the selected product image.
          </DialogDescription>
          <div className="relative aspect-[4/5] w-full max-h-[85vh]">
            {selectedImg && (
              <Image
                src={selectedImg}
                alt="Product Preview"
                fill
                className="rounded-2xl object-contain shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  );
}
