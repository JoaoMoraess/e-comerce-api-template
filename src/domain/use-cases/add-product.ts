import { UUIdHandler } from '@/infra/gateways'
import { DeleteFile, UploadFile } from '@/domain/contracts/gateways'
import { SaveProduct } from '@/domain/contracts/repos'

type Input = {name: string, price: number, description?: string, imageFile: {buffer: Buffer, mimeType: string}, stock: number}
export type AddProduct = (product: Input) => Promise<void>
type Setup = (uuidHandler: UUIdHandler, fileStorage: UploadFile & DeleteFile, productRepo: SaveProduct) => AddProduct

export const setupAddProduct: Setup = (uuidHandler, fileStorage, productRepo) => async ({ stock, description, imageFile, name, price }) => {
  const fileName = uuidHandler.generate(name)
  const imageUrl = await fileStorage.upload({ file: imageFile.buffer, fileName: `${fileName}.${imageFile.mimeType.split('/')[1]}` })
  try {
    await productRepo.save({ name, price, description, imageUrl, stock })
  } catch (error) {
    await fileStorage.delete({ fileName })
    throw error
  }
}
