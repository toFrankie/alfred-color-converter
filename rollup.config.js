const {defineConfig} = require('rollup')
const resolve = require('@rollup/plugin-node-resolve')
const json = require('@rollup/plugin-json')
const babel = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')

module.exports = defineConfig({
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
    exports: 'named',
    sourcemap: false,
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: [['@babel/preset-env', {targets: {node: '12'}}]],
    }),
  ],
})
