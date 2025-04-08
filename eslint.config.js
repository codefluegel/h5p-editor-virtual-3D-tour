import eslintConfigSnordianH5P from 'eslint-config-snordian-h5p';
import pluginReact from 'eslint-plugin-react';

export default [
  eslintConfigSnordianH5P.configs['flat/recommended'],
  {
    name: 'react-config',
    ignores: ['dist/**/*'],
    plugins: {
      react: pluginReact,
    },
    rules: {
      'react/prop-types': 'warn', // If you want to add prop types
      'jsdoc/require-param-type': 'off',
      'jsdoc/tag-lines': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/require-returns-check': 'off',
      'jsdoc/check-types': 'off',
      'brace-style': ['off', '1tbs'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Activate support for JSX
        },
      },
    },
  },
];
