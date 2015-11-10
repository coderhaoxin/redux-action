
import createReducer from '../lib/create-reducer'
import { deepEqual } from 'assert'

describe('## create-reducer', () => {
  const GET_ITEMS = 'GET_ITEMS'
  const ADD_ITEM = 'ADD_ITEM'

  describe('# basic', () => {
    const defaultState = {
      title: 'hello',
      items: [{
        name: 'one'
      }]
    }

    const reducer = createReducer(defaultState, {
      [GET_ITEMS]: (payload, state, action) => {
        return payload
      },

      [ADD_ITEM]: (payload, state, action) => {
        return payload
      }
    })

    it('defaultState, payload', () => {
      const result = reducer(undefined, {
        type: GET_ITEMS,
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
        type: GET_ITEMS,
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
        type: ADD_ITEM,
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
        type: ADD_ITEM,
        title: 'new'
      })

      deepEqual(result, { title: 'new', items: [{ name: 'hello' }] })
    })
  })

  describe('# with immutable', () => {
    const defaultState = {
      title: 'hello',
      items: [{
        name: 'one'
      }]
    }

    const reducer = createReducer(defaultState, {
      [GET_ITEMS]: (payload, state, action) => {
        return payload
      },

      [ADD_ITEM]: (payload, state, action) => {
        return payload
      }
    })

    it('defaultState, payload', () => {
      const result = reducer(undefined, {
        type: GET_ITEMS,
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
        type: GET_ITEMS,
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
        type: ADD_ITEM,
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
        type: ADD_ITEM,
        title: 'new'
      })

      deepEqual(result, { title: 'new', items: [{ name: 'hello' }] })
    })
  })
})
