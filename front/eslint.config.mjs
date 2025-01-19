import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'next/core-web-vitals', // Next.js recommended rules
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // TypeScript rules
    'plugin:jsx-a11y/recommended', // Accessibility rules
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'jsx-a11y'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // Disable the no-explicit-any rule
    // Add other rules here
  },
});
