import { mock, MockProxy } from 'jest-mock-extended'
import { LoadUserByEmail, SaveUser } from '@/domain/contracts/repos'
import { AccessToken } from '@/domain/entities'
import { TokenGenerator, Hasher } from '@/domain/contracts/gateways'
import { Registration, setupRegistration } from '@/domain/use-cases'

describe('Registration', () => {
  let sut: Registration
  let usersRepo: MockProxy<LoadUserByEmail & SaveUser>
  let hasher: MockProxy<Hasher>
  let tokenHandler: MockProxy<TokenGenerator>
  let name: string
  let email: string
  let password: string

  beforeAll(() => {
    usersRepo = mock<LoadUserByEmail & SaveUser>()
    usersRepo.loadByEmail.mockResolvedValue(null)
    usersRepo.save.mockResolvedValue({ id: 'any_id' })
    hasher = mock<Hasher>()
    hasher.hash.mockResolvedValue('hashed_string')
    tokenHandler = mock<TokenGenerator>()
    tokenHandler.generate.mockResolvedValue('any_token')
  })

  beforeEach(() => {
    name = 'any_name'
    email = 'any_email@gmail.com'
    password = 'any_password'
    sut = setupRegistration(usersRepo, hasher, tokenHandler)
  })

  it('should call usersRepo.loadByEmail with correct input', async () => {
    await sut({ email, name, password })

    expect(usersRepo.loadByEmail).toHaveBeenCalledWith({ email })
    expect(usersRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })

  it('should return null if usersRepo.loadByEmail not returns null', async () => {
    usersRepo.loadByEmail.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
      password: 'hashed_password',
      role: 'customer'
    })
    const authenticationModel = await sut({ email, name, password })

    expect(authenticationModel).toEqual(null)
  })
  it('should call hasher.hash with correct input', async () => {
    await sut({ email, name, password })

    expect(hasher.hash).toHaveBeenCalledWith({ plainText: password })
    expect(hasher.hash).toBeCalledTimes(1)
  })
  it('should call usersRepo.save with correct input', async () => {
    await sut({ email, name, password })

    expect(usersRepo.save).toHaveBeenCalledWith({ email, name, password: 'hashed_string' })
    expect(usersRepo.save).toBeCalledTimes(1)
  })
  it('should call tokenHandler.generate with correct input', async () => {
    await sut({ email, name, password })

    expect(tokenHandler.generate).toHaveBeenCalledWith({ key: 'any_id', userRole: 'customer', expirationInMs: AccessToken.expirationInMs })
    expect(tokenHandler.generate).toBeCalledTimes(1)
  })
  it('should return the correct data on success', async () => {
    const authenticationModel = await sut({ email, name, password })

    expect(authenticationModel).toEqual({
      token: 'any_token',
      name: 'any_name'
    })
  })
  it('should rethrow usersRepo.loadByEmail throw', async () => {
    usersRepo.loadByEmail.mockRejectedValueOnce(new Error('repo_error'))
    const promise = sut({ email, name, password })

    await expect(promise).rejects.toThrow(new Error('repo_error'))
  })

  it('should rethrow hasher throw', async () => {
    hasher.hash.mockRejectedValueOnce(new Error('hasher_error'))
    const promise = sut({ email, name, password })

    await expect(promise).rejects.toThrow(new Error('hasher_error'))
  })
  it('should rethrow usersRepo.save throw', async () => {
    usersRepo.save.mockRejectedValueOnce(new Error('repo_error'))
    const promise = sut({ email, name, password })

    await expect(promise).rejects.toThrow(new Error('repo_error'))
  })
})
