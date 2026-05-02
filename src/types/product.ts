export type Category = string;

export interface Product {
  id: string | number;
  name: string;
  originalPrice: number;
  price: number;
  cat: Category;
  isNew: boolean;
  img: string;
}

export interface CartItem extends Product {
  qty: number;
}
