
import createAction from '../lib/create-action'
import { deepEqual } from 'assert'

const GET_ITEMS = 'GET_ITEMS'

function testAction(action, expected, ...args) {
  return new Promise((resolve) => {
    const dispatch = (data) => {
      deepEqual(data, expected)
      resolve(data)
    }

    const getState = () => {
      return {
        info: 'test'
      }
    }

    const runner = action(...args)
    runner(dispatch, getState)
  })
}

function rejectPromise() {
  return Promise.reject(new Error('rejected'))
}

describe('## create-action', () => {
  describe('# basic', () => {
    it('createAction(type, payload)', () => {
      const action01 = createAction(GET_ITEMS, 123)
      const action02 = createAction(GET_ITEMS, { name: 'hi' })
      const action03 = createAction(GET_ITEMS, [1, 2, 3])

      return Promise.all([
        testAction(action01, {
          type: 'GET_ITEMS',
          payload: 123
        }),

        testAction(action02, {
          type: 'GET_ITEMS',
          payload: { name: 'hi' }
        }),

        testAction(action03, {
          type: 'GET_ITEMS',
          payload: [1, 2, 3]
        })
      ])
    })

    it('createAction(type, syncPayloadCreator)', () => {
      const action01 = createAction(GET_ITEMS, (a, b, c) => ({a, b, c}))
      const action02 = createAction(GET_ITEMS, name => name)
      const action03 = createAction(GET_ITEMS, function(name) {
        return {
          state: this.getState(),
          name
        }
      })

      return Promise.all([
        testAction(action01, {
          type: 'GET_ITEMS',
          payload: { a: 'a', b: 'b', c: 'c' }
        }, 'a', 'b', 'c'),

        testAction(action02, {
          type: 'GET_ITEMS',
          payload: 'hello'
        }, 'hello'),

        testAction(action03, {
          payload: { state: { info: 'test' }, name: 'world' },
          type: 'GET_ITEMS'
        }, 'world')
      ])
    })

    it('createAction(type, asyncPayloadCreator)', () => {
      const action01 = createAction(GET_ITEMS, (a, b, c) => {
        return new Promise((resolve) => {
          setTimeout(resolve({a, b, c}), 500)
        })
      })

      const action02 = createAction(GET_ITEMS, function(name) {
        return new Promise((resolve) => {
          setTimeout(resolve({
            state: this.getState(),
            name
          }), 500)
        })
      })

      const action03 = createAction(GET_ITEMS, () => Promise.reject('oh'))

      // no catch
      const action04 = createAction(GET_ITEMS, () => {
        return rejectPromise()
      })

      // catch
      const action05 = createAction(GET_ITEMS, () => {
        return rejectPromise().catch((err) => {
          console.error(err)
        })
      })

      return Promise.resolve([
        testAction(action01, {
          type: 'GET_ITEMS',
          payload: { a: 'a', b: 'b', c: 'c' }
        }, 'a', 'b', 'c'),

        testAction(action02, {
          type: 'GET_ITEMS',
          payload: { state: { info: 'test' }, name: 'hello' }
        }, 'hello'),

        testAction(action03, {}, 'none'),

        testAction(action04, {}),

        testAction(action05, {
          type: 'GET_ITEMS',
          payload: undefined
        })
      ])
    })
  })
})
