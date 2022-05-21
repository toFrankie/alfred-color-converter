import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
  },
  external: ['alfy', 'color-convert'],
  plugins: [
    terser(),
    copy({
      targets: [{ src: 'src/asserts/**/*', dest: 'dist/asserts' }],
    }),
  ],
}
