
function throwError(msg) {
  throw new Error(msg)
}

function isFunc(val) {
  return typeof val === 'function'
}

export {
  throwError,
  isFunc
}
