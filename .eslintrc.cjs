module.exports = {
  extends: ["cesium/browser"],
  env: {
    browser: true,
    node: true,
  },
  globals: {
    Promise: "readonly",
    Set: "readonly",
    Map: "readonly",
    WeakMap: "readonly",
  },
  plugins: ["import"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: false,
      modules: true,
    },
  },
  rules: {
    "import/extensions": ["error", "ignorePackages"],
    "no-console": [
      "error",
      {
        allow: ["warn", "error", "info"],
      },
    ],
    "import/no-extraneous-dependencies": [
      "warn",
      {
        devDependencies: ["build/*.mjs"],
      },
    ],
    "react/prop-types": ["off"],
    "lit-plugin(no-complex-attribute-binding)": ["off"],
    "no-restricted-syntax": [
      "warn",
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],
  },
  settings: {
    node: {
      extensions: [".js", ".mjs"],
    },
    "import/resolver": {
      "./scripts/inline-resolver.cjs": {
        importMap: "./docs/index.html",
      },
    },
  },
};
