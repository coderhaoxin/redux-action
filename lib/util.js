
export function throwError(msg) {
  throw new Error(msg)
}

export function isFunc(val) {
  return typeof val === 'function'
}

export function isString(val) {
  return typeof val === 'string'
}
