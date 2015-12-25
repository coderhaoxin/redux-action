
import { throwError, isFunc } from './util'

export default function createSyncAction(type, payloadCreator, metaCreator) {
  return (...args) => {
    const payload = isFunc(payloadCreator) ? payloadCreator(...args) : payloadCreator
    const result = {
      payload,
      type
    }

    if (isFunc(metaCreator)) {
      result.meta = metaCreator(...args)
    }

    return result
  }
}
