import { LoadProductsByIds } from '@/domain/contracts/repos'
import { LocalProducts } from '@/domain/entities'
import { InvalidCartError, NoLongerInStock } from '@/domain/errors'

export type CheckProductsIsValid = (input: { localProducts: LocalProducts }) => Promise<Error | null>

type SetCheckProductsIsValid = (productsRepo: LoadProductsByIds) => CheckProductsIsValid

export const setCheckProductIsValid: SetCheckProductsIsValid = (productsRepo) => async ({ localProducts }) => {
  const ids = Object.keys(localProducts)
  const products = await productsRepo.loadByIds(ids)
  if (products.length !== ids.length) return new InvalidCartError()
  const outOfStockProduct = products
    .filter((product) => product.stock - localProducts[product.id] < 0)
    .map(item => ({ name: item.name, inStock: item.stock }))[0]
  if (outOfStockProduct !== undefined) return new NoLongerInStock(outOfStockProduct.name, outOfStockProduct.inStock)
  return null
}
