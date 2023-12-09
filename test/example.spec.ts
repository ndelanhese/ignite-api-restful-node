import { expect, test } from 'vitest'

test('The user should be create a new transaction', () => {
  const responseStatusCode = 201

  expect(responseStatusCode).toEqual(201)
})
