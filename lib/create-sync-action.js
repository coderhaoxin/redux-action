
import { isFunc } from './util'

export default function createSyncAction(type, payloadCreator, metaCreator) {
  function noop(payload) {
    return payload
  }

  return (...args) => {
    const payload = isFunc(payloadCreator) ? payloadCreator(...args) : noop(args[0])
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
