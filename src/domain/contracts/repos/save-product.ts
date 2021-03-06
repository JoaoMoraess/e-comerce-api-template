export interface SaveProduct {
  save: (product: {name: string, price: number, description?: string, imageUrl: string, stock: number}) => Promise<void>
}
