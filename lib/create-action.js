
import { isFunc, isString } from './util'
import createType from './create-type'

function noop(payload = {}) {
  return payload
}

export default function createAction(type, payloadCreator, metaCreator) {
  if (!isString(type)) {
    type = createType()
    payloadCreator = type
    metaCreator = payloadCreator
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

  fn.toString = () => type

  return fn
}
