import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoadCartController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.get('/cart/info', adapt(makeLoadCartController()))
}