/* eslint-disable global-require */
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('css-mqpacker'),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};