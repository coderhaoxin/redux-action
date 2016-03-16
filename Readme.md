
[![Build status][travis-img]][travis-url]
[![Test coverage][codecov-img]][codecov-url]
[![NPM version][npm-img]][npm-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

### redux-action

```js
import { createAction, createReducer } from 'redux-action'
```

* Inspired by [redux-actions](https://github.com/acdlite/redux-actions)
* Uses `dispatch` with `Promise chain`
* Async support (Promise)
* `payload` first reducer
* Assign updated data to state automatically
* Works with `redux-thunk`

### APIs

* `createAction`

```js
import { createAction } from 'redux-action'

const action = createAction('action', (...args) => {
  // ...
  return payload
})

const asyncAction = createAction('async action', (...args) => {
  // ...
  return Promise.resolve(payload)
})
```

* `createReducer`

```js
import { createReducer } from 'redux-action'

const reducer = createReducer(defaultState, {
  'action': (payload, state, action) => {
    // ...
    // only return updated state
    // will assign to state automatically
    return updatedData
  },

  'async action': (payload, state, action) => {
    // ...
    return updatedData
  },

  'common usage': payload => ({some: payload}),
})
```

* Uses `dispatch` with `Promise`

```js
class Com extends React.Component {
  updateData() {
    const { dispatch } = this.props

    dispatch(updateData)
      .then(dispatch(fetchData))
      .then(anyAction)
  }

  render() {
    // ...
  }
}
```

### Full example

* store.js

```js

import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import reducer from './reducer'

const createStoreWithMiddleware = applyMiddleware(
  reduxThunk
)(createStore)

const store = createStoreWithMiddleware(reducer)

export default store

```

* action.js

```js

import { createAction } from 'redux-action'

export const setUserStatus = createAction('set user status', status => status)
export const getUserInfo = createAction('get user info', Promise.resolve(userInfo))
```

* reducer.js

```js

import { createReducer } from 'redux-action'
import { combineReducers } from 'redux'

const defaultState = {
  status: 'normal',
  info: {},
}

const user = createReducer(defaultState, {
  'set user status': status => ({status}),
  'get user info': info => ({info}),
})

// combine reducers

const rootReducer = combineReducers({
  user,
})

export default rootReducer
```

### See also

* [gaearon/redux-thunk](https://github.com/gaearon/redux-thunk)

### License
MIT

[npm-img]: https://img.shields.io/npm/v/redux-action.svg?style=flat-square
[npm-url]: https://npmjs.org/package/redux-action
[travis-img]: https://img.shields.io/travis/coderhaoxin/redux-action.svg?style=flat-square
[travis-url]: https://travis-ci.org/coderhaoxin/redux-action
[codecov-img]: https://img.shields.io/codecov/c/github/coderhaoxin/redux-action.svg?style=flat-square
[codecov-url]: https://codecov.io/github/coderhaoxin/redux-action?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[david-img]: https://img.shields.io/david/coderhaoxin/redux-action.svg?style=flat-square
[david-url]: https://david-dm.org/coderhaoxin/redux-action
