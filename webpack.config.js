const webpack = require('webpack'),
      path = require('path'),
      CopyWebpackPlugin = require('copy-webpack-plugin');
      ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const chromeExtensionReloaderOptions = {
  entries: { 
    contentScript: 'content', 
    background: 'background'
  }
}

module.exports = {
  context: path.resolve('src'),
  entry: {
    content: './content/',
    background: './background/',
    popup: './popup.js',
    optionsPage: './optionsPage.js'
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
    ]),

    process.env.NODE_ENV !== 'production' ? new ChromeExtensionReloader(chromeExtensionReloaderOptions) : null
  ].filter(plugin => !!plugin),

  devtool: '#inline-cheap-source-map'
}
