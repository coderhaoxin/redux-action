
import { throwError, isFunc } from './util'
import clone from 'clone'

const assign = Object.assign

/**
 * @param {Object} handlers
 * @param {Object} defaultState
 */

export default function createReducer(defaultState, handlers) {
  if (typeof defaultState !== 'object') {
    return throwError('invalid defaultState')
  }

  if (typeof handlers !== 'object') {
    return throwError('invalid handlers')
  }

  return (state = defaultState, action) => {
    const type = action.type

    // TODO: check Immutable data type

    if (!type) {
      return assign({}, state)
    }

    const handler = handlers[type]

    if (!isFunc(handler)) {
      return assign({}, state)
    }

    return clone(assign({}, state, executeHandler(handler, state, action)))
  }
}

/**
 * private
 */

function executeHandler(handler, state, action) {
  let result

  if (action.hasOwnProperty('payload')) {
    result = handler(action.payload, state, action)
  } else {
    // TODO: remove this, only standard `payload`
    console.warn('non standard action support will be removed')
    result = handler(pickAction(action), state, action)
  }

  return assign({}, state, result)
}

function pickAction(action) {
  const ignoreKeys = ['type', 'payload', 'error', 'meta']
  const payload = {}

  Object.keys(action).forEach(key => {
    if (ignoreKeys.indexOf(key) === -1) {
      payload[key] = action[key]
    }
  })

  return payload
}
