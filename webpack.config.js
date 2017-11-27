// Packages
const webpack = require('webpack'),
      path = require('path'),
      axios = require('axios');

// Webpack Plugins
const CopyPlugin = require('copy-webpack-plugin');

// Paths
const srcPath = path.join(__dirname, 'src'),
      distPath = path.join(__dirname, 'dist'),
      node_modulesPath = path.join(__dirname, 'node_modules')

module.exports = {
  resolve: {
    alias: {
      src: srcPath
    }
  },
  context: srcPath,
  entry: {
    content: './content/',
    background: './background/',
    popup: './popup.js',
    optionsPage: './optionsPage.js',
    setupPage: './setupPage.js'
  },
  output: {
    path: distPath,
    filename: './[name].js'
  },

  module: {
    rules: [
      { test: /\.sass$/, use: ['style-loader', 'css-loader', 'sass-loader'], exclude: /node_modules/ }
    ]
  },

  plugins: [
    new CopyPlugin([
      'manifest.json',
      'html/**/*',
      'assets/**/*'
    ], {
      ignore: [
        '**/*.psd'
      ]
    })
  ],

  devtool: '#inline-cheap-source-map'
}
