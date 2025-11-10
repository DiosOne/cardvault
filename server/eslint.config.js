import js from "@eslint/js";
import globals from "globals";
import airbnbBase from "eslint-config-airbnb-base";

export default [
    {
        ignores: ["node_modules/**"],
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        extends: [js.configs.recommended, airbnbBase],
        rules: {
            "no-console": "off",
            "quotes": ["error", "double"],
            "indent": ["error", "2"],
            "comma-dangle": ["error", "always"],
        },
    },
];

