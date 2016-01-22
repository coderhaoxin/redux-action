
import { throwError, isFunc } from './util'

function noop(payload) {
  return payload
}

export default function createAction(type, payloadCreator, metaCreator) {
  payloadCreator = isFunc(payloadCreator) ? payloadCreator : noop

  return (...args) => {
    return (dispatch, getState) => {
      return Promise
        .resolve(payloadCreator.apply({getState}, args))
        .then(payload => {
          const result = {
            payload,
            type
          }

          if (isFunc(metaCreator)) {
            result.meta = metaCreator(...args)
          }

          dispatch(result)
        })
    }
  }
}
