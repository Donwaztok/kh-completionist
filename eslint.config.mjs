import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";
import unusedImports from "eslint-plugin-unused-imports";
import _import from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    prettierConfig,

    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "unused-imports": unusedImports,
            import: _import,
            prettier,
        },
        rules: {
            "no-console": "warn",
            "react/prop-types": "off",
            "react-hooks/exhaustive-deps": "off",
            "prettier/prettier": "warn",
            "jsx-a11y/click-events-have-key-events": "warn",
            "jsx-a11y/interactive-supports-focus": "warn",
            "no-unused-vars": "off",
            "unused-imports/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    args: "after-used",
                    ignoreRestSiblings: false,
                    argsIgnorePattern: "^_.*?$",
                },
            ],
            "import/order": [
                "warn",
                {
                    groups: [
                        "type",
                        "builtin",
                        "object",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                    ],
                    pathGroups: [
                        {
                            pattern: "~/**",
                            group: "external",
                            position: "after",
                        },
                    ],
                    "newlines-between": "always",
                },
            ],
            "react/self-closing-comp": "warn",
            "react/jsx-sort-props": [
                "warn",
                {
                    callbacksLast: true,
                    shorthandFirst: true,
                    noSortAlphabetically: false,
                    reservedFirst: true,
                },
            ],
            "padding-line-between-statements": [
                "warn",
                {
                    blankLine: "always",
                    prev: "*",
                    next: "return",
                },
                {
                    blankLine: "always",
                    prev: ["const", "let", "var"],
                    next: "*",
                },
                {
                    blankLine: "any",
                    prev: ["const", "let", "var"],
                    next: ["const", "let", "var"],
                },
            ],
        },
    },

    globalIgnores([
        ".now/*",
        "**/*.css",
        "**/.changeset",
        "**/dist",
        "esm/*",
        "public/*",
        "tests/*",
        "scripts/*",
        "**/*.config.js",
        "**/.DS_Store",
        "**/node_modules",
        "**/coverage",
        "**/.next",
        "**/build",
    ]),
]);
