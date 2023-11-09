// eslint-disable-next-line
const rewireSass = require('react-app-rewire-scss');
// eslint-disable-next-line
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

/* config-overrides.js */
module.exports = function override(config, env) {
  config = rewireSass(config, env);

  config = rewireLess.withLoaderOptions({
    modifyVars: { '@font-family': "'Helvetica'" },
    javascriptEnabled: true
  })(config, env);

  config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }], config);

  // with loaderOptions
  // config = rewireSass.withLoaderOptions(someLoaderOptions)(config, env);
  return config;
};
