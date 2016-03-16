
import createSyncAction from '../lib/create-sync-action'
import { equal, deepEqual } from 'assert'

describe('## create-sync-action', () => {
  describe('# basic', () => {
    it('createSyncAction(type, payload)', () => {
      const action = createSyncAction('get items')

      testAction(action, {
        type: 'get items',
        payload: 123
      }, 123)

      testAction(action, {
        type: 'get items',
        payload: { name: 'hi' }
      }, { name: 'hi' })

      testAction(action, {
        type: 'get items',
        payload: [1, 2, 3]
      }, [1, 2, 3])
    })

    it('createSyncAction(type, syncPayloadCreator)', () => {
      const action01 = createSyncAction('get items', (a, b, c) => ({a, b, c}))
      const action02 = createSyncAction('get items', name => name)

      testAction(action01, {
        type: 'get items',
        payload: { a: 'a', b: 'b', c: 'c' }
      }, 'a', 'b', 'c')

      testAction(action02, {
        type: 'get items',
        payload: 'hello'
      }, 'hello')
    })

    it('createSyncAction(type, syncPayloadCreator, metaCreator)', () => {
      const action01 = createSyncAction('get items', name => name, { desc: 'nothing' })
      const action02 = createSyncAction('get items', name => name, name => name)

      testAction(action01, {
        type: 'get items',
        payload: 'hello'
      }, 'hello')

      testAction(action02, {
        type: 'get items',
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
