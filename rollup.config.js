const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const node = require('rollup-plugin-node-resolve');


module.exports = {
  input: './lib/icheques.js',
  external: ["bipbop-webservice", "bipbop-websocket"],
  plugins: [
    node({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    buble({
      transforms: { forOf: false },
    }),
  ],
  output: {
    name: 'ICheques',
    exports: 'default',
    file: 'bundle.js',
    format: 'umd',
    globals: {
      'bipbop-webservice': 'BipbopWebService',
      'bipbop-websocket': 'BipbopWebSocket',
    }
  },
};
