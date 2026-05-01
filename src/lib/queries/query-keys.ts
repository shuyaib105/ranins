export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (filters: string) => [...queryKeys.products.all, { filters }] as const,
    detail: (id: string) => [...queryKeys.products.all, id] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (status?: string) => [...queryKeys.orders.all, { status }] as const,
    detail: (id: string) => [...queryKeys.orders.all, id] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  settings: {
    all: ["settings"] as const,
  },
};
