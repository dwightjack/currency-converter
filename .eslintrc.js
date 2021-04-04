module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
