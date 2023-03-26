module.exports = {
    extends: [
      'mantine',
      'plugin:@next/next/recommended',
    ],
    plugins: ["unused-imports"],
    parserOptions: {
      project: './tsconfig.json',
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      
    },
  };