
import createAction from '../lib/create-action'
import { equal, deepEqual } from 'assert'

const GET_ITEMS = 'GET_ITEMS'

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

      // catch
      const action03 = createAction(GET_ITEMS, (name) => {
        return rejectPromise().catch((err) => {
          equal(err.message, 'rejected')
        }).then(() => name)
      })

      return Promise.all([
        testAction(action01, {
          type: 'GET_ITEMS',
          payload: { a: 'a', b: 'b', c: 'c' }
        }, 'a', 'b', 'c'),

        testAction(action02, {
          type: 'GET_ITEMS',
          payload: { state: { info: 'test' }, name: 'hello' }
        }, 'hello'),

        testAction(action03, {
          type: 'GET_ITEMS',
          payload: 'world'
        }, 'world')
      ])
    })

    it('meta', () => {
      const action01 = createAction(GET_ITEMS, (a, b, c) => {
        return new Promise((resolve) => {
          setTimeout(resolve({a, b, c}), 500)
        })
      }, { desc: 'nothing' })

      const action02 = createAction(GET_ITEMS, (a, b, c) => {
        return new Promise((resolve) => {
          setTimeout(resolve({a, b, c}), 500)
        })
      }, (a, b, c) => ({a, b, c}))

      return Promise.all([
        testAction(action01, {
          type: 'GET_ITEMS',
          payload: { a: 'a', b: 'b', c: 'c' },
        }, 'a', 'b', 'c'),

        testAction(action02, {
          type: 'GET_ITEMS',
          payload: { a: 'a', b: 'b', c: 'c' },
          meta: { a: 'a', b: 'b', c: 'c' }
        }, 'a', 'b', 'c')
      ])
    })
  })

  describe('edge cases', () => {
    it('error', () => {
      const action01 = createAction(GET_ITEMS, () => { throw new Error('1') })
      const action02 = createAction(GET_ITEMS, () => Promise.reject(new Error('2')))
      const action03 = createAction(GET_ITEMS, () => Promise.reject('2'))

      let count = 0

      return Promise.all([
        testAction(action01).catch((e) => {
          equal(e.message, '1')
          ++count
        }),
        testAction(action02).catch((e) => {
          equal(e.message, '2')
          ++count
        }),
        testAction(action03).catch((data) => {
          equal(data, '2')
          ++count
        })
      ]).then(() => {
        equal(count, 3)
      })
    })
  })
})

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

    resolve(runner(dispatch, getState))
  })
}

function rejectPromise() {
  return Promise.reject(new Error('rejected'))
}
