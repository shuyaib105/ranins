"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { CartView } from "@/components/cart-view";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
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
import { Toaster } from "@/components/ui/sonner";
import { useHomeState } from "@/hooks/use-home-state";

export default function Home() {
  const {
    loading,
    categories,
    currentView,
    setCurrentView,
    currentFilter,
    setCurrentFilter,
    setSearchQuery,
    selectedImg,
    setSelectedImg,
    cart,
    cartCount,
    totalAmount,
    updateQty,
    removeFromCart,
    filteredProducts,
    categoryName,
    handleQuickBuy,
    handleAddToCart,
  } = useHomeState();

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
                {categories?.map((cat) => (
                  <DropdownMenuItem
                    key={cat.$id}
                    className="cursor-pointer rounded-xl px-5 py-3.5 text-[13px] font-bold transition-all hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setCurrentFilter(cat.slug)}
                  >
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>


        <h2 className="mb-8 border-l-8 border-primary pl-4 text-xl font-bold">
          {categoryName}
        </h2>


        {loading ? (


          <div className="flex justify-center py-20">
            <Spinner className="size-10" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
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
