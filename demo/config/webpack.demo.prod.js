
var merge = require( 'webpack-merge' );
var common = require( './webpack.demo.common.js' );

module.exports = merge( common, {
  mode: 'production',
  devtool: 'source-map'
} );
