
import { throwError, isFunc } from './util'

export default function createAction(type, payloadCreator, metaCreator) {
  // for now, only work with redux-thunk
  // and promise (async)
  return (...args) => {
    return (dispatch, getState) => {
      return Promise
        .resolve(isFunc(payloadCreator) ? payloadCreator.apply({getState}, args) : payloadCreator)
        .then((payload) => {
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
