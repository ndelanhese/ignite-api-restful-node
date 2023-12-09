import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('pnpm exec knex migrate:rollback --all')
    execSync('pnpm exec knex migrate:latest')
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
  })

  it('Should be able to get a specific transactions', async () => {
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

    const transactionId = getTransactionsResponse.body.data[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)

    expect(getTransactionResponse.body).toEqual(
      expect.objectContaining({
        title: 'New test transaction',
        amount: 5000,
      }),
    )
  })

  it('Should be able to get summary transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New test transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Another New test transaction',
        amount: 1000,
        type: 'debit',
      })

    const getSummaryTransactionsResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    expect(getSummaryTransactionsResponse.body).toEqual({
      amount: 4000,
    })
  })
})
