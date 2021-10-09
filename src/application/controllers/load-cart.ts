import { LocalCartProducts, ProductCartItem } from '@/domain/entities'
import { Controller } from '.'
import { HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = { localProducts: LocalCartProducts }
type Model = { products: ProductCartItem, subTotal: number }

export class LoadCartController extends Controller {
  constructor (private readonly loadCartInfo: any) {
    super()
  }

  override async perform ({ localProducts }: HttpRequest): Promise<HttpResponse<Model>> {
    const { products, subTotal } = await this.loadCartInfo({ localProducts })
    return ok({ products, subTotal })
  }

  override buildValidators ({ localProducts }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder
        .of({ fieldValue: localProducts, fieldName: 'localProducts' })
        .required()
        .build()
    ]
  }
}
