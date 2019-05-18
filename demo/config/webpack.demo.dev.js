
var merge = require( 'webpack-merge' );
var common = require( './webpack.demo.common.js' );

module.exports = merge( common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './demo/dist',
    port: 9000,
  },
} );
