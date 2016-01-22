
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![NPM version][npm-img]][npm-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

### redux-action

* similar to `redux-actions`
* use `dispatch` with `Promise` for `async` actions
* `payload` first
* async support (promise)
* works with `redux-thunk`

### APIs

* `createAction`

```js
import { createAction } from 'redux-action'

const action = createAction('ACTION', (...args) => {
  // ...
  return payload
})

const asyncAction = createAction('ASYNC_ACTION', (...args) => {
  // ...
  return Promise.resolve(payload)
})
```

* `createReducer`

```js
import { createReducer } from 'redux-action'

const reducer = createReducer(defaultState, {
  'ACTION': (payload, state, action) => {
    // ...
    // only return updated state
    // will assign to state automatically
    return {
      something
    }
  },
  'ASYNC_ACTION': (payload, state, action) => {
    // ...
    return {
      something
    }
  }
})
```

* use `dispatch` with `Promise` support

```js
class Com extends React.Component {
  updateData() {
    const { dispatch } = this.props

    dispatch(updateData)
      .then(fetchData)
      .then(...)
      .catch(...)
  }
  render() {
    // ...
  }
}
```

### See also

* [gaearon/redux-thunk](https://github.com/gaearon/redux-thunk)

### License
MIT

[npm-img]: https://img.shields.io/npm/v/redux-action.svg?style=flat-square
[npm-url]: https://npmjs.org/package/redux-action
[travis-img]: https://img.shields.io/travis/onebook/redux-action.svg?style=flat-square
[travis-url]: https://travis-ci.org/onebook/redux-action
[coveralls-img]: https://img.shields.io/coveralls/onebook/redux-action.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/onebook/redux-action?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[david-img]: https://img.shields.io/david/onebook/redux-action.svg?style=flat-square
[david-url]: https://david-dm.org/onebook/redux-action
