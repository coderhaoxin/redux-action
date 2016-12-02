
import createAction from '../lib/create-action'
import { equal, deepEqual } from 'assert'

describe('## create-action', () => {

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
          payload: 123
        }, 123),

        testAction(action, {
          type,
          payload: 0
        }, 0),

        testAction(action, {
          type,
          payload: null
        }, null),

        testAction(action, {
          type,
          payload: false
        }, false),

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
      const action01 = createAction( (a, b, c) => {
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