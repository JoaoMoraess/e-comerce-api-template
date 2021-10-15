import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { Validator, ValidationBuilder, Required, RequiredString, RequiredNumber } from '@/application/validation'

type HttpRequest = {
  productsIds: string[]
  cep: string
  cardNumber: number
  cardExpirationMoth: number
  cardExpirationYear: number
  cardSecurityCode: number
  cardHolderName: string
}

class MakePurchaseController extends Controller {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor () {
    super()
  }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse<any>> {
    return {
      statusCode: 200,
      data: ''
    }
  }

  override buildValidators ({
    productsIds,
    cep,
    cardExpirationMoth,
    cardExpirationYear,
    cardHolderName,
    cardNumber,
    cardSecurityCode
  }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: productsIds, fieldName: 'productsIds' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cep, fieldName: 'cep' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardExpirationMoth, fieldName: 'cardExpirationMoth' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardExpirationYear, fieldName: 'cardExpirationYear' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardHolderName, fieldName: 'cardHolderName' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardNumber, fieldName: 'cardNumber' })
        .required().build(),
      ...ValidationBuilder.of({ fieldValue: cardSecurityCode, fieldName: 'cardSecurityCode' })
        .required().build()
    ]
  }
}

describe('MakePurchaseController', () => {
  let httpRequest: HttpRequest
  let sut: MakePurchaseController
  beforeEach(() => {
    httpRequest = {
      productsIds: ['any_id', 'other_id'],
      cep: '94750-000',
      cardExpirationMoth: 4,
      cardExpirationYear: 2021,
      cardHolderName: 'Joao M',
      cardNumber: 2123123422,
      cardSecurityCode: 876
    }
  })
  beforeEach(() => {
    sut = new MakePurchaseController()
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators', async () => {
    const validators = sut.buildValidators(httpRequest)

    expect(validators).toEqual([
      new Required(httpRequest.productsIds, 'productsIds'),
      new RequiredString(httpRequest.cep, 'cep'),
      new RequiredNumber(httpRequest.cardExpirationMoth, 'cardExpirationMoth'),
      new RequiredNumber(httpRequest.cardExpirationYear, 'cardExpirationYear'),
      new RequiredString(httpRequest.cardHolderName, 'cardHolderName'),
      new RequiredNumber(httpRequest.cardNumber, 'cardNumber'),
      new RequiredNumber(httpRequest.cardSecurityCode, 'cardSecurityCode')
    ])
  })
})
