import { mock, MockProxy } from 'jest-mock-extended'

interface LoadUserByEmail {
  loadByEmail: (field: string) => Promise<{id: string, name: string, password: string} | null>
}

interface HashComparer {
  compare: (plaintext: string, digest: string) => Promise<boolean>
}

type Setup = (userRepo: LoadUserByEmail, hashComparer: HashComparer) => Authentication
export type Authentication = (input: { email: string, password: string }) => Promise<{name: string, token: string} | null>

export const setAuthentication: Setup = (userRepo, hashComparer) => async ({ email, password }) => {
  const user = await userRepo.loadByEmail(email)

  if (user !== undefined && user !== null) {
    console.log(user)
  }

  return null
}

describe('Authentication', () => {
  let userRepo: MockProxy<LoadUserByEmail>
  let hashComparer: MockProxy<HashComparer>
  let sut: Authentication
  let email: string
  let password: string

  beforeAll(() => {
    userRepo = mock()
    userRepo.loadByEmail.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      password: 'any_password'
    })
    hashComparer = mock()
    hashComparer.compare.mockResolvedValue(true)
  })
  beforeEach(() => {
    email = 'any_email@gmail.com'
    password = 'any_password_123'
    sut = setAuthentication(userRepo, hashComparer)
  })

  it('should call userRepo.loadByEmail with correct input', async () => {
    await sut({ email, password })

    expect(userRepo.loadByEmail).toHaveBeenCalledWith(email)
    expect(userRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })
  it('should return null if userRepo.loadByEmail returns undefined', async () => {
    userRepo.loadByEmail.mockResolvedValueOnce(null)
    const userData = await sut({ email, password })

    expect(userData).toEqual(null)
  })
})
