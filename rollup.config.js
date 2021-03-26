import clear from 'rollup-plugin-clear';
import { babel } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import image from '@rollup/plugin-image';
import styles from 'rollup-plugin-styles';
import dts from "rollup-plugin-dts";

export default [
  {
    input: 'index.ts',
    output: {
      dir: 'lib',
      format: 'commonjs',
      sourcemap: true,
      assetFileNames: "[name][extname]",
    },
    plugins: [
      clear({
        targets: ['lib', 'es']
      }),
      typescript({
        allowJs: true,
        module: true,
        declaration: true,
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: [
          ...DEFAULT_EXTENSIONS,
          '.ts',
          '.tsx'
        ]
      }),
      styles({
        mode: 'extract',
        less: { javascriptEnabled: true },
        extensions: ['.less', '.css'],
        use: ['less'],
        url: { inline: true },
      }),
    ],
  },
  {
    input: 'index.ts',
    output: {
      dir: 'lib',
      format: 'es',
      sourcemap: true,
      assetFileNames: "[name][extname]",
    },
    plugins: [
      clear({
        targets: ['lib/index.d.ts']
      }),
      typescript({
        allowJs: true,
        module: true,
        declaration: true,
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: [
          ...DEFAULT_EXTENSIONS,
          '.ts',
          '.tsx'
        ]
      }),
      styles({
        mode: 'extract',
        less: { javascriptEnabled: true },
        extensions: ['.less', '.css'],
        use: ['less'],
        url: { inline: true },
      }),
      dts()
    ],
  },
]