'use strict'

const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')

// Set BABEL_ENV to use proper preset config
process.env.BABEL_ENV = 'test'

const baseConfig = require('../../webpack.renderer.js')

let webpackConfig = merge(baseConfig, {
  devtool: '#inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"testing"'
    })
  ]
})

// don't treat dependencies as externals
delete webpackConfig.entry
delete webpackConfig.externals
//delete webpackConfig.output.libraryTarget

//// apply svelte option to apply babel-loader on js
//webpackConfig.module.rules
//  .find(rule => rule.use.loader === 'svelte-loader').use.options.loaders.js = 'babel-loader'

// don't emit CSS when testing
webpackConfig.module.rules
  .find(rule => rule.use.loader === 'svelte-loader').use.options.emitCss = false

module.exports = config => {
  config.set({
    browsers: ['visibleElectron'],
    client: {
      useIframe: false
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    customLaunchers: {
      'visibleElectron': {
        base: 'Electron',
        flags: ['--show']
      }
    },
    frameworks: ['mocha', 'chai'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    reporters: ['spec', 'coverage'],
    singleRun: true,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  })
}
