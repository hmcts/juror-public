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

    { from: 'node_modules/govuk-frontend/govuk/all.js', to: '../client/js/govuk' },

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
      context: 'client/assets/documents/',
      from: '*.pdf',
      to: '../client/assets/documents',
    },
    {
      context: 'client/assets/images/',
      from: '*.{png,jpg,jpeg,gif,svg}',
      to: '../client/assets/images',
    },
    {
      context: 'node_modules/govuk-frontend/govuk/assets/images/',
      from: '*.*',
      to: '../client/assets/images',
    },
  ],
});

module.exports = {
  plugins: [copyClientCode],
};
