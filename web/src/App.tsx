import { useState, useEffect, useMemo } from 'react'
import type { Product, CartItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Menu, Search, ShoppingBag, X, ChevronDown, ChevronLeft, MessageCircle } from 'lucide-react'

const WA_NUMBER = "8801918318094"

const CAT_NAMES: Record<string, string> = {
  'all': 'All Collection',
  'islamic': 'Islamic Content',
  'motivational': 'Motivational Content',
  'classical': 'Classical Content',
  'musicband': 'Music Band Content'
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [currentFilter, setCurrentFilter] = useState('all')
  const [isNewOnly, setIsNewOnly] = useState(false)
  const [useNewJson, setUseNewJson] = useState(false)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'shop' | 'cart'>('shop')
  const [loading, setLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const file = useNewJson ? '/new.json' : '/product.json'
        const response = await fetch(file)
        if (!response.ok) throw new Error('Failed to load products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [useNewJson])

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = currentFilter === 'all' || p.cat === currentFilter
      const matchNew = !isNewOnly || p.isNew
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchNew && matchSearch
    })
  }, [products, currentFilter, isNewOnly, search])

  const cartCount = useMemo(() => cart.reduce((a, b) => a + b.qty, 0), [cart])
  const totalAmount = useMemo(() => cart.reduce((a, b) => a + (b.price * b.qty), 0), [cart])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const changeQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta
        return newQty > 0 ? { ...item, qty: newQty } : item
      }
      return item
    }).filter(item => item.qty > 0))
  }

  const quickBuy = (p: Product) => {
    const cat = CAT_NAMES[p.cat] || p.cat
    const msg = `Hi! I want to know more about this product:\n\n🆔 ID: ${p.id}\n🛍️ Product: ${p.name}\n📂 Category: ${cat}\n💰 Price: ৳ ${p.price}`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const completeOrder = () => {
    const list = cart.map(i => `• [${i.id}] ${i.name} — ${CAT_NAMES[i.cat] || i.cat} — ${i.qty} pcs`).join('\n')
    const msg = `Order List:\n\n${list}\n\n💵 Total Bill: ৳ ${totalAmount}\n\nPlease confirm my order.`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="rounded-full bg-muted/50" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-6">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-xl font-black italic">MENU</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                <p className="mb-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">Categories</p>
                {Object.entries(CAT_NAMES).map(([key, name]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    className={cn(
                      "justify-start rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all",
                      currentFilter === key && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      setCurrentFilter(key)
                      setView('shop')
                    }}
                  >
                    {name}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <img 
              src="https://raw.githubusercontent.com/shuyaib105/ranins-/refs/heads/main/Ranins%20logo%20file.png" 
              alt="Ranins Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              className="relative h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
              onClick={() => setView('cart')}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background text-[9px] font-bold text-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Filter / Search Bar */}
        {isSearchOpen && (
          <div className="border-t bg-background p-4 animate-in slide-in-from-top duration-300">
            <div className="container mx-auto max-w-lg space-y-4">
              <Input 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-full px-6 h-12 bg-muted/50"
              />
              <div className="flex items-center justify-center gap-4 py-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">All Products</span>
                <button 
                  className={cn(
                    "relative h-7 w-14 rounded-full transition-colors duration-300",
                    useNewJson ? "bg-primary" : "bg-muted"
                  )}
                  onClick={() => setUseNewJson(!useNewJson)}
                >
                  <span className={cn(
                    "absolute top-1 left-1 h-5 w-5 rounded-full bg-background shadow-md transition-transform duration-300",
                    useNewJson && "translate-x-7"
                  )} />
                </button>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  useNewJson ? "text-foreground" : "text-muted-foreground"
                )}>New Drop</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {view === 'shop' ? (
        <main className="container mx-auto px-4 py-8">
          {/* Hero & Intro */}
          <section className="mx-auto max-w-2xl text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">Welcome to Ranins!</h1>
            <p className="text-muted-foreground text-sm leading-relaxed px-4">
              Looking for high-quality, 100% cotton t-shirts that are budget-friendly? We've got you covered! Premium quality, affordable prices.
            </p>
          </section>

          <section className="mx-auto max-w-4xl mb-12">
            <img 
              src="https://raw.githubusercontent.com/shuyaib105/ranins-/refs/heads/main/20%25%20off%20.webp" 
              alt="20% Off Sale" 
              className="w-full h-auto object-cover rounded-3xl shadow-xl"
            />
          </section>

          {/* Controls */}
          <section className="mx-auto max-w-2xl mb-8">
            <div className="flex gap-2 justify-center items-center flex-wrap">
              <Button 
                variant={!isNewOnly && currentFilter === 'all' ? "default" : "outline"}
                className="rounded-full h-10 px-6 text-[10px] font-black uppercase tracking-widest"
                onClick={() => {
                  setIsNewOnly(false)
                  setCurrentFilter('all')
                }}
              >
                New Drop
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" className="rounded-full h-10 px-6 text-[10px] font-black uppercase tracking-widest gap-2" />}>
                  Categories <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-2xl p-2" align="center">
                  {Object.entries(CAT_NAMES).map(([key, name]) => (
                    <DropdownMenuItem 
                      key={key}
                      className="rounded-xl font-bold text-sm py-3 px-4 cursor-pointer"
                      onClick={() => setCurrentFilter(key)}
                    >
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative">
                <Button variant="outline" disabled className="rounded-full h-10 px-6 text-[10px] font-black uppercase tracking-widest opacity-60">
                  Customize
                </Button>
                <Badge className="absolute -top-2 -right-2 bg-destructive text-[7px] font-black animate-pulse-border border-2">COMING SOON</Badge>
              </div>
            </div>
          </section>

          <h2 className="text-xl font-black mb-8 border-l-8 border-primary pl-4 uppercase tracking-tight">
            {CAT_NAMES[currentFilter] || 'Collection'}
          </h2>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredProducts.map((p) => (
                <Card key={p.id} className="group relative overflow-hidden rounded-[24px] border-muted bg-card transition-all hover:translate-y-[-8px] hover:shadow-2xl">
                  {p.isNew && (
                    <Badge className="absolute top-4 left-4 z-10 bg-foreground text-background text-[8px] font-black rounded-full px-3 py-1 uppercase tracking-widest">
                      NEW DROP
                    </Badge>
                  )}
                  <div 
                    className="aspect-[4/5] overflow-hidden m-2 rounded-[18px] bg-muted cursor-pointer"
                    onClick={() => setPreviewImage(p.img)}
                  >
                    <img 
                      src={p.img} 
                      alt={p.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-5 pt-2">
                    <p className="text-[9px] text-muted-foreground font-black tracking-widest mb-1 uppercase">SKU: {p.id}</p>
                    <h3 className="text-sm font-bold truncate mb-2">{p.name}</h3>
                    
                    {currentFilter === 'all' && (
                      <Badge variant="secondary" className="mb-3 text-[9px] font-black rounded-full uppercase">
                        {CAT_NAMES[p.cat] || p.cat}
                      </Badge>
                    )}

                    <div className="flex items-center gap-2 mb-1 mt-1">
                      <span className="text-[11px] font-semibold text-muted-foreground line-through">৳ {p.originalPrice}</span>
                      <span className="text-sm font-black text-destructive">৳ {p.price}</span>
                    </div>
                    <p className="text-[9px] text-destructive font-black mb-4 uppercase tracking-widest">20% OFF</p>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => addToCart(p)}
                        className="w-full rounded-full h-10 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                      >
                        Add to Bag
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => quickBuy(p)}
                        className="w-full rounded-full h-10 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                      >
                        Quick Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-muted-foreground italic">No products found in this category.</p>
                </div>
              )}
            </div>
          )}
        </main>
      ) : (
        <main className="container mx-auto px-4 py-10 max-w-2xl min-h-screen">
          <div className="flex items-center gap-6 mb-12">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-muted/50"
              onClick={() => setView('shop')}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h2 className="text-3xl font-black">Your Cart</h2>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-6 bg-card p-4 rounded-[32px] border shadow-sm">
                <img src={item.img} className="w-20 h-24 object-cover rounded-[20px]" />
                <div className="flex-grow min-w-0">
                  <p className="text-[9px] font-black text-muted-foreground">#{item.id}</p>
                  <h4 className="text-sm font-bold truncate">{item.name}</h4>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm font-black">৳ {item.price}</span>
                    <div className="flex items-center bg-muted rounded-full px-2 py-1">
                      <button onClick={() => changeQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center font-bold">-</button>
                      <span className="px-3 text-[12px] font-black">{item.qty}</span>
                      <button onClick={() => changeQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center font-bold">+</button>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}

            {cart.length > 0 ? (
              <div className="mt-16 border-t pt-10">
                <div className="flex justify-between items-center mb-10 px-4">
                  <span className="uppercase text-[11px] font-black tracking-[5px] text-muted-foreground">Total Bill</span>
                  <span className="text-4xl font-black">৳ {totalAmount}</span>
                </div>
                <Button 
                  onClick={completeOrder}
                  className="w-full h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-md font-black shadow-2xl transition-all active:scale-95 gap-3"
                >
                  <MessageCircle className="h-6 w-6 fill-current" />
                  Complete Order on WhatsApp
                </Button>
              </div>
            ) : (
              <div className="text-center py-40">
                <p className="text-xl text-muted-foreground italic">Your cart is currently empty...</p>
                <Button 
                  variant="link" 
                  onClick={() => setView('shop')}
                  className="mt-4 font-bold"
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center mb-10">
              <img 
                src="https://raw.githubusercontent.com/shuyaib105/ranins-/refs/heads/main/Ranins%20logo%20file.png" 
                alt="Ranins" 
                className="h-16 w-auto object-contain invert mb-6"
              />
              <div className="flex gap-4">
                <a href="https://wa.me/8801918318094" target="_blank" className="h-12 w-12 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-110 transition-transform">
                  <MessageCircle className="h-6 w-6 fill-current text-white" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61575292375203" target="_blank" className="h-12 w-12 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>
            
            <div className="border-t border-muted/20 pt-8">
              <p className="text-muted-foreground text-sm">
                &copy; 2026 <span className="font-black italic">Ranins</span>. All rights reserved.
              </p>
              <p className="text-muted-foreground/60 text-xs mt-2 font-medium tracking-widest uppercase">
                Premium Quality • Affordable Prices
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden border-none bg-black/90">
          <DialogHeader className="sr-only">
            <DialogTitle>Product Image Preview</DialogTitle>
          </DialogHeader>
          <div className="relative flex items-center justify-center w-full h-full">
            <img 
              src={previewImage || ''} 
              alt="Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
