export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  img: string;
  cat: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  qty: number;
}
