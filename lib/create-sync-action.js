
import { throwError, isFunc } from './util'

export default function createSyncAction(type, payloadCreator) {
  return (...args) => {
    const payload = isFunc(payloadCreator) ? payloadCreator(...args) : payloadCreator
    return {
      payload,
      type
    }
  }
}
