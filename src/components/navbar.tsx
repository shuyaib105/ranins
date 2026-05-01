"use client";

import Image from "next/image";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Category } from "@/types/product";

interface NavbarProps {
  cartCount: number;
  onSearch: (value: string) => void;
  onCategorySelect: (cat: Category) => void;
  onCartClick: () => void;
}

export function Navbar({
  cartCount,
  onSearch,
  onCategorySelect,
  onCartClick,
}: NavbarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const categories: { id: Category; name: string }[] = [
    { id: "all", name: "Exclusive Collection" },
    { id: "islamic", name: "Islamic Content" },
    { id: "motivational", name: "Motivational Content" },
    { id: "classical", name: "Classical Content" },
    { id: "musicband", name: "Music Band Content" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-lg safe-area-pt">
      <div className="container mx-auto flex h-20 items-center justify-between px-fluid-md pt-4 pb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-muted shadow-sm hover:bg-muted/80">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6 flex flex-col">
            <SheetHeader className="mb-10 text-left">
              <SheetTitle className="text-xl font-black italic">MENU</SheetTitle>
              <SheetDescription className="sr-only">
                Main navigation menu with product categories.
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-2 flex-grow">
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Categories
              </p>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant="ghost"
                  className="justify-start px-4 py-6 rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all text-sm"
                  onClick={() => onCategorySelect(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">Thank you for being with us.</p>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-center">
          <Image
            src="https://raw.githubusercontent.com/shuyaib105/ranins-/refs/heads/main/Ranins%20logo%20file.png"
            alt="Ranins Logo"
            width={120}
            height={48}
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-muted hover:bg-muted/80"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Search />
          </Button>
          <Button
            className="relative rounded-full bg-primary shadow-lg hover:bg-primary/90"
            size="icon"
            onClick={onCartClick}
          >
            <ShoppingBag />
            <Badge className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border-2 border-background p-0 text-[10px] font-bold">
              {cartCount}
            </Badge>
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="border-t bg-background p-6 shadow-2xl rounded-b-[40px] animate-in fade-in slide-in-from-top-2">
          <div className="container mx-auto max-w-lg space-y-4">
            <Input
              placeholder="Search products by name..."
              className="h-12 w-full rounded-full border-border bg-muted px-6 py-3.5 text-sm focus-visible:ring-primary/5"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
