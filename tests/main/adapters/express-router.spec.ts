import { Controller } from '@/application/controllers'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { mock, MockProxy } from 'jest-mock-extended'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { adaptExpressRoute } from '@/main/adapters'

describe('ExpressRouteAdapter', () => {
  let sut: RequestHandler
  let controllerStub: MockProxy<Controller>
  let next: NextFunction
  let req: Request
  let res: Response

  beforeAll(() => {
    req = getMockReq({ body: { anyBody: 'any_data' } })
    res = getMockRes().res
    next = getMockRes().next
    controllerStub = mock()
    controllerStub.buildValidators.mockReturnValue([])
    controllerStub.handle.mockResolvedValue({
      statusCode: 200,
      data: { anyData: 'any_data' }
    })
  })

  beforeEach(() => {
    sut = adaptExpressRoute(controllerStub)
  })

  it('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(controllerStub.handle).toHaveBeenCalledWith({ anyBody: 'any_data' })
    expect(controllerStub.handle).toHaveBeenCalledTimes(1)
  })
  it('should call handle with empty request', async () => {
    const req = getMockReq()
    await sut(req, res, next)

    expect(controllerStub.handle).toHaveBeenCalledWith({})
    expect(controllerStub.handle).toHaveBeenCalledTimes(1)
  })
  it('should respond with 200 and valid data', async () => {
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ anyData: 'any_data' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
  it('should respond with 204 and valid data', async () => {
    controllerStub.handle.mockResolvedValueOnce({
      statusCode: 204,
      data: null
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(204)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith(null)
    expect(res.json).toHaveBeenCalledTimes(1)
  })
  it('should return 400 and valid Error', async () => {
    controllerStub.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error_message')
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error_message' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
  it('should return 500 and valid Error', async () => {
    controllerStub.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error_message')
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error_message' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
