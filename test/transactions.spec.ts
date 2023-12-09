import { expect, it, beforeAll, afterAll, describe, expect } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New test transaction',
      amount: 5000,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('Should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New test transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const getTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    expect(getTransactionsResponse.body).toEqual(
      expect.objectContaining({
        data: [
          expect.objectContaining({
            title: 'New test transaction',
            amount: 5000,
          }),
        ],
      }),
    )
    expect(getTransactionsResponse.statusCode).toEqual(200)
  })
})
