
import createSyncAction from '../lib/create-sync-action'
import { equal, deepEqual } from 'assert'

const GET_ITEMS = 'GET_ITEMS'

describe('## create-action', () => {
  describe('# basic', () => {
    it('createSyncAction(type, payload)', () => {
      const action = createSyncAction(GET_ITEMS)

      testAction(action, {
        type: 'GET_ITEMS',
        payload: 123
      }, 123)

      testAction(action, {
        type: 'GET_ITEMS',
        payload: { name: 'hi' }
      }, { name: 'hi' })

      testAction(action, {
        type: 'GET_ITEMS',
        payload: [1, 2, 3]
      }, [1, 2, 3])
    })

    it('createSyncAction(type, syncPayloadCreator)', () => {
      const action01 = createSyncAction(GET_ITEMS, (a, b, c) => ({a, b, c}))
      const action02 = createSyncAction(GET_ITEMS, name => name)

      testAction(action01, {
        type: 'GET_ITEMS',
        payload: { a: 'a', b: 'b', c: 'c' }
      }, 'a', 'b', 'c')

      testAction(action02, {
        type: 'GET_ITEMS',
        payload: 'hello'
      }, 'hello')
    })

    it('createSyncAction(type, syncPayloadCreator, metaCreator)', () => {
      const action01 = createSyncAction(GET_ITEMS, name => name, { desc: 'nothing' })
      const action02 = createSyncAction(GET_ITEMS, name => name, name => name)

      testAction(action01, {
        type: 'GET_ITEMS',
        payload: 'hello'
      }, 'hello')

      testAction(action02, {
        type: 'GET_ITEMS',
        payload: 'hello',
        meta: 'hello'
      }, 'hello')
    })
  })
})

function testAction(action, expected, ...args) {
  const runner = action(...args)
  deepEqual(runner, expected)
}

function rejectPromise() {
  return Promise.reject(new Error('rejected'))
}
