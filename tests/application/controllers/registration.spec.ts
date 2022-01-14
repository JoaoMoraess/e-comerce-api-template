import { AuthenticationModel } from '@/domain/entities'
import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { Email, RequiredString, Validator, ValidationBuilder } from '@/application/validation'

type HttpRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

type Registration = (input: { name: string, email: string, password: string }) => Promise<AuthenticationModel | null>

class RegistrationController extends Controller {
  constructor (private readonly registration: Registration) { super() }

  override async perform (httpRequest: HttpRequest): Promise<HttpResponse<AuthenticationModel>> {
    return ok({
      name: 'any_name',
      token: 'any_token'
    })
  }

  override buildValidators ({ name, email, password, passwordConfirmation }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldValue: name, fieldName: 'name' }).required().build(),
      ...ValidationBuilder.of({ fieldValue: email, fieldName: 'email' }).required().email().build(),
      ...ValidationBuilder.of({ fieldValue: password, fieldName: 'password' }).required().build(),
      ...ValidationBuilder.of({ fieldValue: passwordConfirmation, fieldName: 'passwordConfirmation' }).required().build()
    ]
  }
}

describe('RegistrationController', () => {
  let sut: RegistrationController
  let registration: jest.Mock
  let httpRequest: HttpRequest

  beforeAll(() => {
    registration = jest.fn().mockResolvedValue({
      name: 'any_name',
      token: 'any_token'
    })
  })

  beforeEach(() => {
    httpRequest = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
    sut = new RegistrationController(registration)
  })

  it('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build validatos correctly on save', async () => {
    const validators = sut.buildValidators({ ...httpRequest })

    expect(validators).toEqual([
      new RequiredString(httpRequest.name, 'name'),
      new RequiredString(httpRequest.email, 'email'),
      new Email(httpRequest.email, 'email'),
      new RequiredString(httpRequest.password, 'password'),
      new RequiredString(httpRequest.passwordConfirmation, 'passwordConfirmation')
    ])
  })
})
