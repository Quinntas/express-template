import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const tsconfig = [
    {...tseslint.configs.recommended[0]},
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
        rules: {
            'constructor-super': 'off',
            'getter-return': 'off',
            'no-const-assign': 'off',
            'no-dupe-args': 'off',
            'no-dupe-class-members': 'off',
            'no-dupe-keys': 'off',
            'no-func-assign': 'off',
            'no-import-assign': 'off',
            'no-new-symbol': 'off',
            'no-new-native-nonconstructor': 'off',
            'no-obj-calls': 'off',
            'no-redeclare': 'off',
            'no-unused-vars': 'off',
            'no-setter-return': 'off',
            'no-this-before-super': 'off',
            'no-undef': 'off',
            'no-unreachable': 'off',
            'no-unsafe-negation': 'off',
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
        },
        name: 'typescript-eslint/eslint-recommended',
    },
    {
        name: 'typescript-eslint/recommended',
        rules: {
            '@typescript-eslint/ban-ts-comment': 'error',
            '@typescript-eslint/ban-types': 'error',
            'no-array-constructor': 'off',
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/no-duplicate-enum-values': 'error',
            '@typescript-eslint/no-extra-non-null-assertion': 'error',
            'no-loss-of-precision': 'off',
            '@typescript-eslint/no-loss-of-precision': 'error',
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
            '@typescript-eslint/no-this-alias': 'error',
            '@typescript-eslint/no-unnecessary-type-constraint': 'error',
            '@typescript-eslint/no-unsafe-declaration-merging': 'error',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-var-requires': 'warn',
            '@typescript-eslint/prefer-as-const': 'error',
            '@typescript-eslint/triple-slash-reference': 'error',
        },
    },
];

export default [
    {files: ['**/*.{js,mjs,cjs,ts}']},
    {languageOptions: {globals: globals.browser}},
    {
        rules: {
            ...pluginJs.configs.recommended.rules,
            'no-unused-vars': 'off',
            'no-undef': 'off',
        },
    },
    ...tsconfig,
];
