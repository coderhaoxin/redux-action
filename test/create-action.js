
import createAction from '../lib/create-action'
import { equal, deepEqual } from 'assert'

const GET_ITEMS = 'GET_ITEMS'

describe('## create-action', () => {
  describe('# basic', () => {
    it('createAction(type, payload)', () => {
      const action = createAction(GET_ITEMS)

      return Promise.all([
        testAction(action, {
          type: 'GET_ITEMS',
          payload: 123
        }, 123),

        testAction(action, {
          type: 'GET_ITEMS',
          payload: 0
        }, 0),

        testAction(action, {
          type: 'GET_ITEMS',
          payload: null
        }, null),

        testAction(action, {
          type: 'GET_ITEMS',
          payload: false
        }, false),

        testAction(action, {
          type: 'GET_ITEMS',
          payload: { name: 'hi' }
        }, { name: 'hi' }),

        testAction(action, {
          type: 'GET_ITEMS',
          payload: [1, 2, 3]
        }, [1, 2, 3])
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

        testAction(action02, {
          type: 'GET_ITEMS',
          payload: {} // default payload
        }),

        testAction(action02, {
          type: 'GET_ITEMS',
          payload: 0
        }, 0),

        testAction(action02, {
          type: 'GET_ITEMS',
          payload: null
        }, null),

        testAction(action02, {
          type: 'GET_ITEMS',
          payload: false
        }, false),

        testAction(action03, {
          payload: { state: { info: 'test' }, name: 'world' },
          type: 'GET_ITEMS'
        }, 'world')
      ])
    })

    it('createAction(type, asyncPayloadCreator)', () => {
      const action01 = createAction(GET_ITEMS, (name) => {
        return new Promise((resolve) => {
          setTimeout(resolve(name), 500)
        })
      })

      const action02 = createAction(GET_ITEMS, (a, b, c) => {
        return new Promise((resolve) => {
          setTimeout(resolve({a, b, c}), 500)
        })
      })

      const action03 = createAction(GET_ITEMS, function(name) {
        return new Promise((resolve) => {
          setTimeout(resolve({
            state: this.getState(),
            name
          }), 500)
        })
      })

      // catch
      const action04 = createAction(GET_ITEMS, (name) => {
        return rejectPromise().catch((err) => {
          equal(err.message, 'rejected')
        }).then(() => name)
      })

      return Promise.all([
        testAction(action01, {
          type: 'GET_ITEMS',
          payload: {} // default payload
        }),

        testAction(action01, {
          type: 'GET_ITEMS',
          payload: 0
        }, 0),

        testAction(action01, {
          type: 'GET_ITEMS',
          payload: null
        }, null),

        testAction(action01, {
          type: 'GET_ITEMS',
          payload: false
        }, false),

        testAction(action02, {
          type: 'GET_ITEMS',
          payload: { a: 'a', b: 'b', c: 'c' }
        }, 'a', 'b', 'c'),

        testAction(action03, {
          type: 'GET_ITEMS',
          payload: { state: { info: 'test' }, name: 'hello' }
        }, 'hello'),

        testAction(action04, {
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
      const action04 = createAction(GET_ITEMS, () => Promise.resolve())
      const action05 = createAction(GET_ITEMS, () => Promise.reject().catch(() => {}))

      let count = 0

      const defVal = {
        type: GET_ITEMS,
        payload: {},
      }

      return Promise.all([
        testAction(action01).catch(e => {
          equal(e.message, '1')
          ++count
        }),
        testAction(action02).catch(e => {
          equal(e.message, '2')
          ++count
        }),
        testAction(action03).catch(s => {
          equal(s, '2')
          ++count
        }),
        testAction(action04, defVal).then(() => {
          ++count
        }),
        testAction(action05, defVal).then(() => {
          ++count
        })
      ]).then(() => {
        equal(count, 5)
      })
    })
  })
})

function testAction(action, expected, ...args) {
  return new Promise((resolve) => {
    const dispatch = data => {
      deepEqual(data, expected)
      resolve(data)
    }

    const getState = () => ({
      info: 'test'
    })

    const runner = action(...args)

    resolve(runner(dispatch, getState))
  })
}

function rejectPromise() {
  return Promise.reject(new Error('rejected'))
}
