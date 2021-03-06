import { UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserByEmail, SaveUser } from '@/domain/contracts/repos'
import { UserRole } from '@/domain/entities'
import { User } from './entities/User'
import { Repository } from './repository'

export class PgUserRepository extends Repository implements LoadUserByEmail, SaveUser {
  private readonly userRepository = this.getRepository<User>('User')

  constructor (private readonly uuidGenerator: UUIDGenerator) { super() }

  async loadByEmail ({ email }: { email: string }): Promise<{ id: string, name: string, password: string, role: UserRole } | null> {
    const user = await this.userRepository.findOne({ email })
    if (user !== undefined && user !== null) {
      const { id, name, password, role } = user
      return { id, name, password, role }
    }
    return null
  }

  async save ({ email, name, password }: { name: string, email: string, password: string }): Promise<{ id: string }> {
    const user = this.userRepository.create({
      id: this.uuidGenerator.generate(),
      name,
      email,
      password,
      role: 'customer'
    })
    await this.userRepository.persistAndFlush(user)

    return { id: user.id }
  }
}
