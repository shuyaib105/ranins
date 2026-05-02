"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductManager } from "@/components/admin/product-manager";
import { OrderManager } from "@/components/admin/order-manager";
import { SettingsManager } from "@/components/admin/settings-manager";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import { LogOut, Package, ShoppingBag, Settings } from "lucide-react";

export default function AdminPage() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" suppressHydrationWarning>
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Ranins <span className="text-gray-400">Admin</span>
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="rounded-full font-bold text-gray-500 hover:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="h-auto w-full justify-start gap-4 bg-transparent p-0">
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 rounded-full border-2 border-transparent bg-white px-6 py-3 font-black transition-all data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white shadow-sm"
            >
              <Package className="h-5 w-5" />
              Products
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 rounded-full border-2 border-transparent bg-white px-6 py-3 font-black transition-all data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white shadow-sm"
            >
              <ShoppingBag className="h-5 w-5" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 rounded-full border-2 border-transparent bg-white px-6 py-3 font-black transition-all data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white shadow-sm"
            >
              <Settings className="h-5 w-5" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="m-0">
            <ProductManager />
          </TabsContent>
          <TabsContent value="orders" className="m-0">
            <OrderManager />
          </TabsContent>
          <TabsContent value="settings" className="m-0">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
