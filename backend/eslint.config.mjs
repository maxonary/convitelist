import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.out/**',
      'build/**',
      'coverage/**',
      'dist/**',
    ],
  },
  
  // Base ESLint recommended config
  js.configs.recommended,
  
  // TypeScript ESLint flat config for recommended rules
  // Using the official flat config preset instead of spreading rules
  ...tseslint.configs['flat/recommended'],
  
  // Custom overrides
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Disable explicit any rule as per project preference
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  
  // Allow require() in JS files (scripts)
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
