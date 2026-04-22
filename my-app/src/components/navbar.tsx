"use client";

import Image from "next/image";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Category } from "@/types/product";

interface NavbarProps {
  cartCount: number;
  onSearch: (value: string) => void;
  useNewJson: boolean;
  onToggleSource: (value: boolean) => void;
  onCategorySelect: (cat: Category) => void;
  onCartClick: () => void;
}

export function Navbar({
  cartCount,
  onSearch,
  useNewJson,
  onToggleSource,
  onCategorySelect,
  onCartClick,
}: NavbarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const categories: { id: Category; name: string }[] = [
    { id: "all", name: "All Collection" },
    { id: "islamic", name: "Islamic Content" },
    { id: "motivational", name: "Motivational Content" },
    { id: "classical", name: "Classical Content" },
    { id: "musicband", name: "Music Band Content" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 pt-4 pb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-50 shadow-sm hover:bg-gray-100">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6 flex flex-col">
            <SheetHeader className="mb-10 text-left">
              <SheetTitle className="text-xl font-black italic">MENU</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 flex-grow">
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Categories
              </p>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant="ghost"
                  className="justify-start px-4 py-6 rounded-xl font-bold hover:bg-black hover:text-white transition-all text-sm"
                  onClick={() => onCategorySelect(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">Thank you for being with us.</p>
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
            className="h-10 w-10 rounded-full bg-gray-50 hover:bg-gray-100"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            className="relative h-10 w-10 rounded-full bg-black shadow-lg hover:bg-gray-800"
            size="icon"
            onClick={onCartClick}
          >
            <ShoppingBag className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-white text-[9px] font-bold text-black">
              {cartCount}
            </span>
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="border-t bg-white p-6 shadow-2xl rounded-b-[40px] animate-in fade-in slide-in-from-top-2">
          <div className="container mx-auto max-w-lg space-y-4">
            <Input
              placeholder="Search products by name..."
              className="h-12 w-full rounded-full border-gray-100 bg-gray-50 px-6 py-3.5 text-sm focus-visible:ring-black/5"
              onChange={(e) => onSearch(e.target.value)}
            />
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className={`text-[10px] font-black uppercase tracking-wider ${!useNewJson ? 'text-black' : 'text-gray-500'}`}>
                All Products
              </span>
              <Switch
                checked={useNewJson}
                onCheckedChange={onToggleSource}
                className="data-[state=checked]:bg-black"
              />
              <span className={`text-[10px] font-black uppercase tracking-wider ${useNewJson ? 'text-black' : 'text-gray-500'}`}>
                New Drop
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
