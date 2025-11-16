import js from '@eslint/js';
import globals from 'globals';

const baseConfig = js.configs.recommended;

export default [
  {
    ignores: ['node_modules/**'],
  },
  {
    ...baseConfig,
    files: ['**/*.js'],
    languageOptions: {
      ...baseConfig.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      ...baseConfig.rules,
      'no-console': 'off',
      'no-unused-vars': 'off',
      quotes: 'off',
      indent: 'off',
      'comma-dangle': 'off',
    },
  },
];
