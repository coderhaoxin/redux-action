
import { throwError, isFunc } from './util'

export default function createAction(type, payloadCreator) {
  // for now, only work with redux-thunk
  // and promise (async)
  return (...args) => {
    return (dispatch, getState) => {
      return Promise
        .resolve(isFunc(payloadCreator) ? payloadCreator.apply({getState}, args) : payloadCreator)
        .then((payload) => {
          dispatch({
            payload,
            type
          })
        })
      // .catch((err) => {
      //   console.error('in',args,err,err.stack)
      //   throw err
      // })
    }
  }
}
