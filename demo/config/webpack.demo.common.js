
var path = require( 'path' );

module.exports = {
  entry: './demo/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
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
