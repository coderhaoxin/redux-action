
import createReducer from '../lib/create-reducer'
import { deepEqual, strictEqual } from 'assert'
import I from 'immutable'

describe('## create-reducer', () => {
  describe('# basic', () => {
    const defaultState = {
      title: 'hello',
      items: [{
        name: 'one'
      }]
    }

    const reducer = createReducer(defaultState, {
      'get items': (payload, state, action) => {
        return payload
      },

      'add item': (payload, state, action) => {
        return payload
      },

      'invalid handler': {}
    })

    it('defaultState, payload', () => {
      const result = reducer(undefined, {
        type: 'get items',
        payload: {
          items: [{
            name: 'two'
          }]
        }
      })

      deepEqual(result, { title: 'hello', items: [{ name: 'two' }] })
    })

    it('state, payload', () => {
      const result = reducer({
        title: 'world',
        items: [{
          name: 'three'
        }]
      }, {
        type: 'get items',
        payload: {
          items: [{
            name: 'two'
          }]
        }
      })

      deepEqual(result, { title: 'world', items: [{ name: 'two' }] })
    })

    it('defaultState, no payload', () => {
      const result = reducer(undefined, {
        type: 'add item',
        title: 'new'
      })

      deepEqual(result, { title: 'new', items: [{ name: 'one' }] })
    })

    it('state, payload', () => {
      const result = reducer({
        title: 'old',
        items: [{
          name: 'hello'
        }]
      }, {
        type: 'add item',
        title: 'new'
      })

      deepEqual(result, { title: 'new', items: [{ name: 'hello' }] })
    })
  })

  describe('# edge cases', () => {
    const defaultState = {
      title: 'hello',
      items: [{
        name: 'one'
      }]
    }

    const reducer = createReducer(defaultState, {
      'get items': (payload, state, action) => {
        return payload
      },

      'add item': (payload, state, action) => {
        return payload
      },
    })

    it('defaultState, payload = null', () => {
      const result = reducer(undefined, {
        type: 'get items',
        payload: null
      })

      deepEqual(result, { title: 'hello', items: [{ name: 'one' }] })
    })

    it('no type', () => {
      const result = reducer(undefined, {})

      deepEqual(result, { title: 'hello', items: [{ name: 'one' }] })
    })

    it('invalid handler', () => {
      const result = reducer(undefined, {
        type: 'invalid handler',
        payload: {
          title: 'should not change'
        }
      })

      deepEqual(result, { title: 'hello', items: [{ name: 'one' }] })
    })

    it('invalid defaultState', () => {
      let done = false

      try {
        createReducer()
      } catch (e) {
        strictEqual(e.message, 'invalid defaultState')
        done = true
      }

      strictEqual(done, true)
    })

    it('invalid handlers', () => {
      let done = false

      try {
        createReducer({})
      } catch (e) {
        strictEqual(e.message, 'invalid handlers')
        done = true
      }

      strictEqual(done, true)
    })
  })

  describe('# with immutable payload property', () => {
    const defaultState = {
      title: 'hello',
      items: [{
        name: 'one'
      }]
    }

    const reducer = createReducer(defaultState, {
      'get items': (payload, state, action) => {
        return {
          items: I.fromJS(payload.items)
        }
      }
    })

    it('defaultState, payload', () => {
      const result = reducer(undefined, {
        type: 'get items',
        payload: {
          items: I.fromJS([{
            name: 'two'
          }])
        }
      })

      result.items = result.items.toJS()

      deepEqual(result, { title: 'hello', items: [{ name: 'two' }] })
    })

    it('state, payload', () => {
      const result = reducer({
        title: 'world',
        items: [{
          name: 'three'
        }]
      }, {
        type: 'get items',
        payload: {
          items: [{
            name: 'two'
          }]
        }
      })

      result.items = result.items.toJS()

      deepEqual(result, { title: 'world', items: [{ name: 'two' }] })
    })
  })

  describe('# with immutable payload', () => {
    console.warn('TODO')
  })

  describe('# with immutable state', () => {
    console.warn('TODO')
  })
})
