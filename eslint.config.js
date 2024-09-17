import js from "@eslint/js";
import * as lit from 'eslint-plugin-lit';

const commonGlobals = {
  URL: "readonly",
  console: "readonly",
  fetch: "readonly",
};

const nodeGlobals = {
  ...commonGlobals,
  process: "readonly",
};

const browserGlobals = {
  ...commonGlobals,
  window: "readonly",
  localStorage: "readonly",
  sessionStorage: "readonly",
  setTimeout: "readonly",
  navigator: "readonly",
  document: "readonly",
  CSSRule: "readonly",
};

export default [
  js.configs.recommended,
  lit.configs['flat/recommended'],
  {
    files: [
      "server/**/*.js",
      "scripts/**/*.js",
    ],
    languageOptions: {
      sourceType: "module",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: false,
          modules: true,
        },
      },
      globals: nodeGlobals,
    },
  },
  {
    files: [
      "docs/**/*.js",
    ],
    languageOptions: {
      sourceType: "module",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: false,
          modules: true,
        },
      },
      globals: browserGlobals,
    },
    rules: {
      "lit/binding-positions": ["off"],
      "lit/no-invalid-html": ["off"],
    }
  },
];
