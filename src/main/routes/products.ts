import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoadProductsController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.get('/products', adapt(makeLoadProductsController()))
}