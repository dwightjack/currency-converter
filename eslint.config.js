// @ts-check
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import ts from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier/recommended';
import svelteParser from 'svelte-eslint-parser';
import unocss from '@unocss/eslint-config/flat';
import globals from 'globals';

export default defineConfig(
  js.configs.recommended,
  ts.configs.strict,
  ts.configs.stylistic,
  unocss,
  svelte.configs['flat/prettier'],
  prettier,
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      globals: { ...globals.node, ...globals.browser },
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ignores: [
      'public/**',
      '!public/index.html',
      'scripts',
      'dist',
      '.netlify',
      'test-results',
    ],
  },
);
