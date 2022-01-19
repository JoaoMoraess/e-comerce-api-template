import { Controller } from '@/application/controllers/controller'
import { HttpResponse } from '@/application/helpers'
import { Validator, RequiredString, NumberLength, RequiredNumber } from '@/application/validation'
import { ValidationBuilder } from '@/application/validation/builder'

class AddProductController extends Controller {
  override async perform (httpRequest: any): Promise<HttpResponse<any>> {
    return {
      data: {},
      statusCode: 200
    }
  }

  override buildValidators ({ name, price, stock }: any): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: name, fieldName: 'name' }).required().build(),
      ...ValidationBuilder.of({ fieldValue: price, fieldName: 'price' }).required().minNumber(0).build(),
      ...ValidationBuilder.of({ fieldValue: stock, fieldName: 'stock' }).required().minNumber(0).build()
    ]
  }
}

describe('AddProductsController', () => {
  let sut: AddProductController
  let httpRequest: any

  beforeEach(() => {
    httpRequest = {
      name: 'pencil',
      price: 1290,
      stock: 5
    }
    sut = new AddProductController()
  })

  it('should extend controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should make validators correctly', async () => {
    const validators = sut.buildValidators(httpRequest)
    expect(validators).toEqual([
      new RequiredString(httpRequest.name, 'name'),
      new RequiredNumber(httpRequest.price, 'price'),
      new NumberLength(httpRequest.price, 'min', 0, 'price'),
      new RequiredNumber(httpRequest.stock, 'stock'),
      new NumberLength(httpRequest.stock, 'min', 0, 'stock')
    ])
  })
})