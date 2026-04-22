"use client";

import { useState, useEffect } from "react";
import { Product, Category } from "@/types/product";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { CartView } from "@/components/cart-view";
import { Footer } from "@/components/footer";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const catNames: Record<string, string> = {
  all: "Exclusive Collection",
  islamic: "Islamic Content",
  motivational: "Motivational Content",
  classical: "Classical Content",
  musicband: "Music Band Content",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"shop" | "cart">("shop");
  const [currentFilter, setCurrentFilter] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [useNewJson, setUseNewJson] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const { cart, addToCart, removeFromCart, updateQty, cartCount, totalAmount } =
    useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const file = useNewJson ? "/new.json" : "/product.json";
        const response = await fetch(file);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [useNewJson]);

  const filteredProducts = products.filter((p) => {
    const matchCat = currentFilter === "all" || p.cat === currentFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleQuickBuy = (product: Product) => {
    const cat = catNames[product.cat] || product.cat;
    const msg = `Hi! I want to know more about this product:\n\n🆔 ID: ${product.id}\n🛍️ Product: ${product.name}\n📂 Category: ${cat}\n💰 Price: ৳ ${product.price}`;
    window.open(
      `https://wa.me/8801918318094?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success("Added to bag");
  };

  if (currentView === "cart") {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900">
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
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar
        cartCount={cartCount}
        onSearch={setSearchQuery}
        useNewJson={useNewJson}
        onToggleSource={setUseNewJson}
        onCategorySelect={(cat) => {
          setCurrentFilter(cat);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onCartClick={() => setCurrentView("cart")}
      />

      <main className="container mx-auto px-4 py-8">
        <section className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight md:text-4xl">
            Welcome to Ranins!
          </h2>
          <p className="px-4 text-sm leading-relaxed text-gray-500">
            Looking for high-quality, 100% cotton t-shirts that are budget-friendly? 
            We&apos;ve got you covered! We aim to bring stylish and comfortable t-shirts 
            to everyone, without breaking the bank. Premium quality, affordable prices. 
            Shop now and express yourself!
          </p>
        </section>

        <Hero />

        <section className="mx-auto mb-8 max-w-2xl px-4">
          <div className="flex items-center justify-center gap-2">
            <Button
              className={`h-auto rounded-full px-4 py-2 text-[9px] font-black uppercase tracking-[1.5px] transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[2px] ${
                currentFilter === "all"
                  ? "bg-black text-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] -translate-y-[2px]"
                  : "bg-transparent text-gray-700 border-2 border-gray-100 hover:border-black hover:text-black hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              }`}
              onClick={() => setCurrentFilter("all")}
            >
              New Drop
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`h-auto rounded-full px-4 py-2 text-[9px] font-black uppercase tracking-[1.5px] transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[2px] ${
                    currentFilter !== "all"
                      ? "bg-black text-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] -translate-y-[2px]"
                      : "bg-transparent text-gray-700 border-2 border-gray-100 hover:border-black hover:text-black hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 rounded-2xl border-gray-200 p-2 shadow-2xl">
                {Object.entries(catNames).map(([id, name]) => (
                  <DropdownMenuItem
                    key={id}
                    className="cursor-pointer rounded-xl px-5 py-3.5 text-[13px] font-bold text-gray-700 transition-all hover:bg-black hover:text-white"
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
                className="h-auto rounded-full border-2 border-gray-100 bg-transparent px-4 py-2 text-[9px] font-black uppercase tracking-[1.5px] text-gray-700 opacity-60 cursor-not-allowed sm:px-6 sm:py-2.5 sm:text-[11px] sm:tracking-[2px]"
              >
                Customize T-Shirt
              </Button>
              <span className="absolute -top-2 -right-2 z-10 animate-pulse rounded-full border-[1.5px] border-[#dc2626] bg-[#ef4444] px-1.5 py-0.5 text-[7px] font-900 uppercase tracking-[1px] text-white">
                Coming Soon
              </span>
            </div>
          </div>
        </section>

        <h2 className="mb-8 border-l-8 border-black pl-4 text-xl font-bold">
          {catNames[currentFilter] || "Collection"}
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-100 border-t-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
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
              <p className="col-span-full py-20 text-center text-gray-400">
                No products found matching your search.
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />

      <Dialog open={!!selectedImg} onOpenChange={() => setSelectedImg(null)}>
        <DialogContent className="max-w-[90vw] border-none bg-transparent p-0 shadow-none outline-none">
          <DialogTitle className="sr-only">Product Image Preview</DialogTitle>
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
