/* eslint-disable */
if (process.env.REACT_APP_ENV === 'prod') {
  module.exports = require('./config.prod');
} else if (process.env.REACT_APP_ENV === 'qa') {
  module.exports = require('./config.qa');
} else if (process.env.REACT_APP_ENV === 'local') {
  module.exports = require('./config.local');
} else {
  module.exports = require('./config.dev');
}
/* eslint-enable */
