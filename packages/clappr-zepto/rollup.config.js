export default {
  input: 'src/zepto.js',
  output: [
    {
      file: 'dist/clappr-zepto.js',
      format: 'umd',
      name: 'Zepto',
      exports: 'default',
      sourcemap: true
    },
    {
      file: 'dist/clappr-zepto.esm.js',
      format: 'esm',
      exports: 'default',
      sourcemap: true
    }
  ],
  treeshake: { moduleSideEffects: true }
}
