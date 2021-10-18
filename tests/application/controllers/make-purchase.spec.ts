import { Controller, MakePurchaseController } from '@/application/controllers'
import { noContent } from '@/application/helpers'
import { Required, RequiredString } from '@/application/validation'
import { LocalProducts } from '@/domain/entities'

type HttpRequest = {
  localProducts: LocalProducts
  cep: string
  cardBrand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'ELO' | 'HIPERCARD' | 'HIPER' | 'DINERS'
  cardNumber: string
  cardExpirationMoth: string
  cardExpirationYear: string
  cardSecurityCode: string
  cardHolderName: string
}

describe('MakePurchaseController', () => {
  let httpRequest: HttpRequest
  let sut: MakePurchaseController
  let makePurchase: jest.Mock

  beforeAll(() => {
    httpRequest = {
      localProducts: {
        any_id: 1,
        other_id: 2
      },
      cardBrand: 'VISA',
      cep: '94750-000',
      cardExpirationMoth: '4',
      cardExpirationYear: '2021',
      cardHolderName: 'Joao M',
      cardNumber: '2123123422',
      cardSecurityCode: '876'
    }
    makePurchase = jest.fn().mockResolvedValue(() => {})
  })
  beforeEach(() => {
    sut = new MakePurchaseController(makePurchase)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validators', async () => {
    const validators = sut.buildValidators(httpRequest)

    expect(validators).toEqual([
      new Required(httpRequest.localProducts, 'localProducts'),
      new RequiredString(httpRequest.cep, 'cep'),
      new RequiredString(httpRequest.cardExpirationMoth, 'cardExpirationMoth'),
      new RequiredString(httpRequest.cardBrand, 'cardBrand'),
      new RequiredString(httpRequest.cardExpirationYear, 'cardExpirationYear'),
      new RequiredString(httpRequest.cardHolderName, 'cardHolderName'),
      new RequiredString(httpRequest.cardNumber, 'cardNumber'),
      new RequiredString(httpRequest.cardSecurityCode, 'cardSecurityCode')
    ])
  })
  it('should call makePurchase with correct input', async () => {
    await sut.handle(httpRequest)

    expect(makePurchase).toHaveBeenCalledWith(httpRequest)
    expect(makePurchase).toHaveBeenCalledTimes(1)
  })
  it('should return noContent on success', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(noContent())
  })
})
