
import createAction from '../lib/create-action'
import { ok, equal, deepEqual } from 'assert'

describe('## create-action', () => {
  describe('# basic', () => {

    it('createAction(type)', () => {
      const action = createAction('get items')
      equal(action.type, 'get items')
      ok(action.toString().startsWith('function fn()'))
    })

    it('createAction(type, payload)', () => {
      const action = createAction('get items')

      return Promise.all([
        testAction(action, {
          type: 'get items',
          payload: 123
        }, 123),

        testAction(action, {
          type: 'get items',
          payload: 0
        }, 0),

        testAction(action, {
          type: 'get items',
          payload: null
        }, null),

        testAction(action, {
          type: 'get items',
          payload: false
        }, false),

        testAction(action, {
          type: 'get items',
          payload: { name: 'hi' }
        }, { name: 'hi' }),

        testAction(action, {
          type: 'get items',
          payload: [1, 2, 3]
        }, [1, 2, 3])
      ])
    })

    it('createAction(type, syncPayloadCreator)', () => {
      const action01 = createAction('get items', (a, b, c) => ({a, b, c}))
      const action02 = createAction('get items', name => name)
      const action03 = createAction('get items', function(name) {
        return {
          state: this.getState(),
          name
        }
      })

      return Promise.all([
        testAction(action01, {
          type: 'get items',
          payload: { a: 'a', b: 'b', c: 'c' }
        }, 'a', 'b', 'c'),

        testAction(action02, {
          type: 'get items',
          payload: 'hello'
        }, 'hello'),

        testAction(action02, {
          type: 'get items',
          payload: {} // default payload
        }),

        testAction(action02, {
          type: 'get items',
          payload: 0
        }, 0),

        testAction(action02, {
          type: 'get items',
          payload: null
        }, null),

        testAction(action02, {
          type: 'get items',
          payload: false
        }, false),

        testAction(action03, {
          payload: { state: { info: 'test' }, name: 'world' },
          type: 'get items'
        }, 'world')
      ])
    })

    it('createAction(type, asyncPayloadCreator)', () => {
      const action01 = createAction('get items', (name) => {
        return new Promise((resolve) => {
          setTimeout(resolve(name), 500)
        })
      })

      const action02 = createAction('get items', (a, b, c) => {
        return new Promise((resolve) => {
          setTimeout(resolve({a, b, c}), 500)
        })
      })

      const action03 = createAction('get items', function(name) {
        return new Promise((resolve) => {
          setTimeout(resolve({
            state: this.getState(),
            name
          }), 500)
        })
      })

      // catch
      const action04 = createAction('get items', (name) => {
        return rejectPromise().catch((err) => {
          equal(err.message, 'rejected')
        }).then(() => name)
      })

      return Promise.all([
        testAction(action01, {
          type: 'get items',
          payload: {} // default payload
        }),

        testAction(action01, {
          type: 'get items',
          payload: 0
        }, 0),

        testAction(action01, {
          type: 'get items',
          payload: null
        }, null),

        testAction(action01, {
          type: 'get items',
          payload: false
        }, false),

        testAction(action02, {
          type: 'get items',
          payload: { a: 'a', b: 'b', c: 'c' }
        }, 'a', 'b', 'c'),

        testAction(action03, {
          type: 'get items',
          payload: { state: { info: 'test' }, name: 'hello' }
        }, 'hello'),

        testAction(action04, {
          type: 'get items',
          payload: 'world'
        }, 'world')
      ])
    })

    it('meta', () => {
      const action01 = createAction('get items', (a, b, c) => {
        return new Promise((resolve) => {
          setTimeout(resolve({a, b, c}), 500)
        })
      }, { desc: 'nothing' })

      const action02 = createAction('get items', (a, b, c) => {
        return new Promise((resolve) => {
          setTimeout(resolve({a, b, c}), 500)
        })
      }, (a, b, c) => ({a, b, c}))

      return Promise.all([
        testAction(action01, {
          type: 'get items',
          payload: { a: 'a', b: 'b', c: 'c' },
        }, 'a', 'b', 'c'),

        testAction(action02, {
          type: 'get items',
          payload: { a: 'a', b: 'b', c: 'c' },
          meta: { a: 'a', b: 'b', c: 'c' }
        }, 'a', 'b', 'c')
      ])
    })
  })

  describe('## create none type action', () => {

    it('createAction()', () => {
      const action = createAction()
      equal(typeof action.type, 'string')
      equal(action.type, action.toString())
    })

    it('createAction(payload)', () => {
      const action = createAction()
      const type = action.type

      return Promise.all([
        testAction(action, {
          type,
          payload: 0
        }, 0),

        testAction(action, {
          type,
          payload: { name: 'hi' }
        }, { name: 'hi' }),

        testAction(action, {
          type,
          payload: [1, 2, 3]
        }, [1, 2, 3])
      ])
    })

    it('meta', () => {
      const action01 = createAction((a, b, c) => {
        return new Promise((resolve) => {
          setTimeout(resolve({a, b, c}), 500)
        })
      }, { desc: 'nothing' })

      const action02 = createAction((a, b, c) => {
        return new Promise((resolve) => {
          setTimeout(resolve({a, b, c}), 500)
        })
      }, (a, b, c) => ({a, b, c}))

      return Promise.all([
        testAction(action01, {
          type: action01.type,
          payload: { a: 'a', b: 'b', c: 'c' },
        }, 'a', 'b', 'c'),

        testAction(action02, {
          type: action02.type,
          payload: { a: 'a', b: 'b', c: 'c' },
          meta: { a: 'a', b: 'b', c: 'c' }
        }, 'a', 'b', 'c')
      ])
    })
  })

  describe('edge cases', () => {
    it('error', () => {
      const action01 = createAction('get items', () => { throw new Error('1') })
      const action02 = createAction('get items', () => Promise.reject(new Error('2')))
      const action03 = createAction('get items', () => Promise.reject('2'))
      const action04 = createAction('get items', () => Promise.resolve())
      const action05 = createAction('get items', () => Promise.reject().catch(() => {}))

      let count = 0

      const defVal = {
        type: 'get items',
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
