import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next' }],
      'no-magic-numbers': ['error', { ignore: [1], ignoreArrayIndexes: true }],
      'no-else-return': 'error',
      'no-param-reassign': 'error',
      'prefer-const': 'error',
      'no-shadow': 'error',
      'no-use-before-define': ['error', { functions: false }],
      'no-new-func': 'error',
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: true, object: true },
        },
      ],
      'prefer-template': 'error',
      'max-lines-per-function': ['warn', { max: 50 }],
    },
  },
];
