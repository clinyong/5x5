var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/main.tsx',
    // the entry point of our app
  ],

  output: {
    filename: 'bundle.js',
    // the output bundle

    path: path.resolve(__dirname, 'dist'),

    publicPath: '/static/'
    // necessary for HMR to know where to load the hot update chunks
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin(),
    // do not emit compiled assets that include errors
  ],

  devServer: {
    host: 'localhost',
    port: 3000,

    historyApiFallback: true,
    // respond to 404s with index.html
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
};
