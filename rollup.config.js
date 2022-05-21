import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
  },
  plugins: [terser()],
  external: [
    'alfy',
    'hex-color-regex',
    'rgb-regex',
    'rgba-regex',
    'color-convert',
    'colors-convert',
  ],
}
