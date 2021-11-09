import { Controller } from '@/application/controllers'
import { DbTransactionController } from '@/application/decorators'
import { makePgConnection } from '@/main/factories/infra/repos/postgres/helpers'

export const makeTransactionController = (controller: Controller): Controller => {
  return new DbTransactionController(controller, makePgConnection())
}
