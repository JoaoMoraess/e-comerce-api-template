import { mock, MockProxy } from 'jest-mock-extended'
import { Authentication, setupAuthentication } from '@/domain/use-cases'
import { LoadUserByEmail } from '@/domain/contracts/repos'
import { HashComparer, TokenGenerator } from '@/domain/contracts/gateways'
import { AccessToken } from '@/domain/entities'

describe('Authentication', () => {
  let usersRepo: MockProxy<LoadUserByEmail>
  let hashComparer: MockProxy<HashComparer>
  let tokenHandler: MockProxy<TokenGenerator>
  let sut: Authentication
  let email: string
  let password: string

  beforeAll(() => {
    usersRepo = mock()
    usersRepo.loadByEmail.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      password: 'any_hasshed_password',
      role: 'customer'
    })
    hashComparer = mock()
    hashComparer.compare.mockResolvedValue(true)
    tokenHandler = mock()
    tokenHandler.generate.mockResolvedValue('encrypted_string')
  })
  beforeEach(() => {
    email = 'any_email@gmail.com'
    password = 'any_password'
    sut = setupAuthentication(usersRepo, hashComparer, tokenHandler)
  })

  it('should call usersRepo.loadByEmail with correct input', async () => {
    await sut({ email, password })

    expect(usersRepo.loadByEmail).toHaveBeenCalledWith({ email })
    expect(usersRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })
  it('should return null if usersRepo.loadByEmail returns null', async () => {
    usersRepo.loadByEmail.mockResolvedValueOnce(null)
    const userData = await sut({ email, password })

    expect(userData).toEqual(null)
  })
  it('should return null if hashComparer.compare returns false', async () => {
    hashComparer.compare.mockResolvedValueOnce(false)
    const userData = await sut({ email, password })

    expect(userData).toEqual(null)
  })
  it('should call hashComparer.compare with correct input', async () => {
    await sut({ email, password })

    expect(hashComparer.compare).toHaveBeenCalledWith({ plainText: password, digest: 'any_hasshed_password' })
    expect(hashComparer.compare).toHaveBeenCalledTimes(1)
  })
  it('should call tokenHandler.generate with correct input', async () => {
    await sut({ email, password })

    expect(tokenHandler.generate).toHaveBeenCalledWith({ key: 'any_id', userRole: 'customer', expirationInMs: AccessToken.expirationInMs })
    expect(tokenHandler.generate).toHaveBeenCalledTimes(1)
  })

  it('should return the correct data on success', async () => {
    const userData = await sut({ email, password })

    expect(userData).toEqual({ name: 'any_name', token: 'encrypted_string' })
  })
  it('should rethrow if usersRepo.loadByEmail throws', async () => {
    usersRepo.loadByEmail.mockRejectedValueOnce(new Error('any_error'))
    const userData = sut({ email, password })

    await expect(userData).rejects.toThrow(new Error('any_error'))
  })
  it('should rethrow if hashComparer.compare throws', async () => {
    hashComparer.compare.mockRejectedValueOnce(new Error('any_error'))
    const userData = sut({ email, password })

    await expect(userData).rejects.toThrow(new Error('any_error'))
  })
})
