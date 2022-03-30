/**
 * Configuration for jest tests
 */

module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./_tests_/config/setup.js'],
  roots: ['./_tests_/src/'],
  globalTeardown: './_tests_/config/teardown.js',
};