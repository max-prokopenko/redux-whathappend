# redux-whathappend
Redux middleware, that records user's actions and exports into a file, that can be exported for further debugging

## Table of contents
* [Install](#install)
* [Usage](#usage)
* [Usage](#usage)
* [License](#license)

## Install
`npm i --save redux-whathappend`

## Usage

### Adding to store

```javascript
import { applyMiddleware, createStore } from 'redux';

// apply redux-whathappend
import whathappend from 'redux-whathappend'
const store = createStore(
  reducer,
  applyMiddleware(whathappend)
)
```

### Exporting report

To export a report of user's actions, just call an action with type


```
WHAT_HAPPEND_REPORT
```



## License
MIT