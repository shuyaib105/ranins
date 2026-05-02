"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { ProductDocument } from "@/lib/queries/product.query";
import { useProducts } from "@/lib/queries/product.query";
import { useSettings } from "@/lib/queries/settings.query";
import { useCategories } from "@/lib/queries/category.query";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";

export function useHomeState() {
  const { data: appwriteProducts, isLoading: loading } = useProducts();
  const { data: settings } = useSettings();
  const { data: categories } = useCategories();
  
  const [currentView, setCurrentView] = useState<"shop" | "cart">("shop");
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [now] = useState(() => Date.now());

  const { cart, addToCart, removeFromCart, updateQty, cartCount, totalAmount } = useCart();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);


  const products: Product[] = (appwriteProducts || [])
    .filter((p: ProductDocument) => !p.isHidden)
    .map((p: ProductDocument) => ({
      id: p.$id!,
      name: p.name,
      originalPrice: p.discountPrice ? p.price : 0,
      price: p.discountPrice || p.price,
      cat: p.category || "all",
      isNew: mounted ? (p.$createdAt ? new Date(p.$createdAt).getTime() > now - 7 * 24 * 60 * 60 * 1000 : false) : false,
      img: p.image ?? "",
    })) || [];

  const filteredProducts = products.filter((p) => {
    const matchCat = currentFilter === "all" || p.cat === currentFilter;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categoryName = categories?.find(c => c.slug === currentFilter)?.name || "Exclusive Collection";

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

  return {
    loading,
    categories,
    currentView,
    setCurrentView,
    currentFilter,
    setCurrentFilter,
    searchQuery,
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
  };
}
