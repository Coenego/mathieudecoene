// stylelint.config.cjs
/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    'stylelint-config-standard-scss'   // v16-compatible base
  ],
  plugins: [
    'stylelint-scss',
    '@stylistic/stylelint-plugin'
  ],
  customSyntax: 'postcss-scss',
  rules: {
    // stylistic rules -> @stylistic/* namespace on v16
    '@stylistic/indentation': 2,
    '@stylistic/linebreaks': 'unix',
    '@stylistic/string-quotes': 'single',

    "custom-property-empty-line-before": null,
    "media-feature-range-notation": null,
    "no-descending-specificity": null,
  },
  ignoreFiles: ['**/node_modules/**', '**/dist/**']
};
