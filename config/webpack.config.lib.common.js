var path = require('path');

module.exports = {
  entry: './src/libIndex.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader']
      },
      {
        test: /\.txt$/i,
        use: [
          'raw-loader'
        ]
      }
    ]
  }
};
