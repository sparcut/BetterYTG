const webpack = require('webpack'),
      path = require('path'),
      CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve('src'),
  entry: {
    content: './js/content/',
    background: './js/background.js',
    popup: './js/popup.js',
    options: './js/options.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: './js/[name].js'
  },

  module: {
    rules: [
      { test: /\.sass$/, use: ['style-loader', 'css-loader', 'sass-loader'], exclude: /node_modules/ },
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      'manifest.json',
      'assets/**/*',
      'html/**/*'
    ])
  ],

  devtool: "inline-cheap-source-map"
}
