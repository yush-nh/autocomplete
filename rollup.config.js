import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/autocomplete.js',
      format: 'es',
      name: 'Autocomplete',
    },
    plugins: [resolve(), commonjs()],
  }
];
