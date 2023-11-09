module.exports = {
  parser: 'babel-eslint',
  settings: {
    env: {
      browser: true,
      es6: true,
    },
    extends: ['plugin:react/recommended', 'airbnb', 'prettier', 'prettier/react'],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: ['react', 'prettier'],
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'react/state-in-constructor': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 1,
      'no-multi-spaces': ['error'],
      'comma-dangle': ['error', 'only-multiline'],
    },
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
};
