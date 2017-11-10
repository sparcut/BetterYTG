const webpack = require('webpack'),
      path = require('path'),
      CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve('src'),
  entry: {
    content: './content/',
    background: './background.js',
    popup: './popup.js',
    options: './options.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: './[name].js'
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

  devtool: 'inline-cheap-source-map'
}
