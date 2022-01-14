import { LoadUserByEmail, SaveUser } from '@/domain/contracts/repos'
import { v4 } from 'uuid'
import { User } from './entities/User'
import { Repository } from './repository'

export class PgUserRepository extends Repository implements LoadUserByEmail, SaveUser {
  private readonly userRepository = this.getRepository<User>('User')

  async loadByEmail ({ email }: { email: string }): Promise<{ id: string, name: string, password: string } | null> {
    const user = await this.userRepository.findOne({ email })
    if (user !== undefined && user !== null) {
      const { id, name, password } = user
      return { id, name, password }
    }
    return null
  }

  async save ({ email, name, password }: { name: string, email: string, password: string }): Promise<{ id: string }> {
    const user = this.userRepository.create({
      id: v4(),
      name,
      email,
      password,
      role: null
    })
    await this.userRepository.persistAndFlush(user)

    return { id: user.id }
  }
}
