"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublicImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onQuickBuy: (p: Product) => void;
  onImageClick: (img: string) => void;
  showCategory?: boolean;
}

const catNames: Record<string, string> = {
  all: "All Collection",
  islamic: "Islamic Content",
  motivational: "Motivational Content",
  classical: "Classical Content",
  musicband: "Music Band Content",
};

export function ProductCard({
  product,
  onAddToCart,
  onQuickBuy,
  onImageClick,
  showCategory,
}: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[24px] border border-border bg-card transition-all duration-400 hover:-translate-y-2 hover:border-primary hover:shadow-[0_20px_30px_rgba(0,0,0,0.05)]">
      {product.isNew && (
        <Badge className="absolute top-5 left-5 z-10 rounded-full bg-primary px-3 py-1 text-[8px] font-black tracking-[1.5px] text-primary-foreground hover:bg-primary">
          NEW DROP
        </Badge>
      )}
      
      <div 
        className="relative m-2.5 aspect-[4/5] cursor-pointer overflow-hidden rounded-[18px] bg-muted"
        onClick={() => onImageClick(getPublicImageUrl(product.img))}
      >
        <Image
          src={getPublicImageUrl(product.img)}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5 pt-2 flex flex-col flex-1">
        <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          SKU: {product.id}
        </p>
        <h3 className="mb-2 truncate text-sm font-bold text-foreground">{product.name}</h3>
        
        {showCategory && (
          <div className="mb-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-wider">
              {catNames[product.cat] || product.cat}
            </Badge>
          </div>
        )}

        <div className="mt-auto">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground line-through">
              ৳ {product.originalPrice}
            </span>
            <span className="text-sm font-black text-destructive">
              ৳ {product.price}
            </span>
          </div>
          <p className="mb-4 text-[9px] font-bold text-destructive">20% OFF</p>
          
          <div className="flex flex-col gap-3">
            <Button
              className="w-full rounded-full bg-primary text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg transition-transform hover:scale-[1.03] hover:bg-primary/90"
              onClick={() => onAddToCart(product)}
            >
              Add to Bag
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-[1.5px] border-primary bg-transparent text-[10px] font-black uppercase tracking-widest text-foreground transition-all hover:bg-muted"
              onClick={() => onQuickBuy(product)}
            >
              Quick Buy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
