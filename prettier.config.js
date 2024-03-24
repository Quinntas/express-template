/** @type {import("prettier").Config} */
const config = {
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    bracketSpacing: false,
    bracketSameLine: true,
    arrowParens: 'always',
    plugins: ['@trivago/prettier-plugin-sort-imports'],
    endOfLine: 'lf',
    importOrder: ['^[./]'],
    importOrderSeparation: false,
    importOrderSortSpecifiers: true,
    proseWrap: 'preserve',
    printWidth: 160,
};

module.exports = config;
