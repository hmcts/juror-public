/* eslint-disable strict */
const CopyWebpackPlugin = require('copy-webpack-plugin');

const clientJs = [
  'jquery.min.js',
  'html5shiv.min.js',
  'respond.min.js',
  'svgxuse.min.js',
  'ds-datepicker.js',
  'cookies.js',
];

const copyClientCode = new CopyWebpackPlugin({
  patterns: [
    { from: 'client/**/*.njk', to: '../' },
    { from: 'server/**/*.js', to: '../' },
    {
      from: 'client/js/*.js',
      to: '../',
      filter: (file) => {
        const parts = file.split('/');

        return clientJs.includes(parts[parts.length - 1]);
      },
    },

    { from: 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js', to: '../client/js/govuk' },
    { from: 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js.map', to: '../client/js/govuk' },

    { from: 'config/', to: '../config' },
    { from: 'package.json', to: '../' },
    { from: 'Dockerfile', to: '../' },

    // copy fonts, documents and images
    {
      context: 'client/assets/fonts/',
      from: '*.*',
      to: '../client/assets/fonts',
    },
    {
      context: 'node_modules/govuk-frontend/dist/govuk/assets/fonts/',
      from: '*.*',
      to: '../client/assets/fonts',
    },
    {
      context: 'node_modules/govuk-frontend/dist/govuk/assets/rebrand/',
      from: '**/*.*',
      to: '../client/assets/rebrand',
    },
    {
      context: 'client/assets/documents/',
      from: '*.pdf',
      to: '../client/assets/documents',
    },
    {
      context: 'node_modules/govuk-frontend/dist/govuk/assets/rebrand/',
      from: '*.*',
      to: '../client/assets/rebrand',
    },
    {
      context: 'client/assets/images/',
      from: '*.{png,jpg,jpeg,gif,svg}',
      to: '../client/assets/images',
    },
    {
      context: 'node_modules/govuk-frontend/dist/govuk/assets/images/',
      from: '*.*',
      to: '../client/assets/images',
    },
    {
      context: 'node_modules/@scottish-government/pattern-library/dist/images/icons/',
      from: '*.*',
      to: '../client/assets/images/icons',
    },
  ],
});

module.exports = {
  plugins: [copyClientCode],
};
