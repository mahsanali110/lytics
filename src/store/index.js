if (process.env.REACT_APP_ENV === 'prod') {
  // eslint-disable-next-line global-require
  module.exports = require('./configureStore.prod');
} else if (process.env.REACT_APP_ENV === 'stage') {
  // eslint-disable-next-line global-require
  module.exports = require('./configureStore.stage');
} else if (process.env.REACT_APP_ENV === 'qa') {
  // eslint-disable-next-line global-require
  module.exports = require('./configureStore.qa');
} else {
  // eslint-disable-next-line global-require
  module.exports = require('./configureStore.dev');
}
