import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
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
  
  // React flat config for recommended rules
  {
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  
  // Custom overrides
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      // Disable explicit any rule as per project preference
      '@typescript-eslint/no-explicit-any': 'off',
      
      // Temporarily disable this rule to fix the build error with react-scripts 5.0.1
      // The rule has issues with option shape when ESLint 9 + TypeScript ESLint 8.x
      // is used by react-scripts which bundles ESLint 8.x internally.
      // TODO: Re-enable once migrating away from react-scripts (to Vite/Next.js)
      //       or upgrading to a react-scripts version that supports ESLint 9
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];
