
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/mv-tilt-card.js',
    output: {
      file: 'build/mv-tilt-card.min.js',
      format: 'iife',
    },
    plugins: [
        terser({
          ecma: 2020,
          mangle: { toplevel: true },
          compress: {
            module: true,
            toplevel: true,
            unsafe_arrows: true,
            drop_console: true,
            drop_debugger: true
          },
          output: { quote_style: 1 }
        }),
        nodeResolve(),
        commonjs({
            include: '/node_modules/**',
            sourceMap: false,
        })
      ]
  };