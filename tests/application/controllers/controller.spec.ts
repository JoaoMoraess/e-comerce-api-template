import { badRequest, HttpResponse, serverError } from '@/application/helpers'
import { ValidationComposite, Validator } from '@/application/validation'
import { ServerError } from '@/application/errors'
import { mocked } from 'ts-jest/utils'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)
    if (error !== undefined) return badRequest(error)
    try {
      return await this.perform(httpRequest)
    } catch (error) {
      return serverError(error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
jest.mock('@/application/validation/composite')

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  async perform (httpRequest: any): Promise<HttpResponse> {
    return this.result
  }
}

describe('Controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const validationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(ValidationComposite).mockImplementationOnce(validationCompositeSpy)

    const httpResponse = await sut.handle('any_value')

    expect(ValidationComposite).toHaveBeenCalledWith([])
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })
  it('should return 500 if perform throws', async () => {
    const error = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
  it('should return 500 if perform throws', async () => {
    jest.spyOn(sut, 'perform').mockRejectedValueOnce('perform_error')

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError()
    })
  })
  it('should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })
})
