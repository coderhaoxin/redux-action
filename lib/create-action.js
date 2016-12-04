
import { isFunc, isString } from './util'
import uuid from 'uuid/v1'

function noop(payload = {}) {
  return payload
}

export default function createAction(type, payloadCreator, metaCreator) {
  let autoType = ''

  if (!isString(type)) {
    metaCreator = payloadCreator
    payloadCreator = type
    type = autoType = uuid()
  }

  payloadCreator = isFunc(payloadCreator) ? payloadCreator : noop

  const fn = (...args) => {
    return (dispatch, getState) => {
      return Promise
        .resolve(payloadCreator.apply({getState}, args))
        .then((payload = {}) => {
          const result = {
            payload,
            type
          }

          if (isFunc(metaCreator)) {
            result.meta = metaCreator(...args)
          }

          dispatch(result)
          /**
           * why need to return result
           * use case
           *   dispatch(...).then(result => ...)
           * warning: no test cases for this (TODO)
           */
          return result
        })
    }
  }

  fn.type = type

  if (autoType) {
    fn.toString = () => type
  }

  return fn
}
