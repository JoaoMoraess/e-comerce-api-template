import { UserRole } from '@/domain/entities'

export interface TokenGenerator {
  generate: (input: TokenGenerator.Input) => Promise<TokenGenerator.Output>
}

export namespace TokenGenerator {
  export type Input = {
    userRole: UserRole
    key: string
    expirationInMs: number
  }
  export type Output = string
}

export interface TokenValidator {
  validate: (input: TokenValidator.Input) => Promise<TokenValidator.Output>
}

export namespace TokenValidator {
  export type Input = {token: string}
  export type Output = {key: string, userRole: UserRole}
}
