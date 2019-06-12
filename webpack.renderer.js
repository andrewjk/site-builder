const preprocess = require('svelte-preprocess')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

module.exports = {
  mode,
  target: 'electron-renderer',
  resolve: {
    extensions: ['.mjs', '.js', '.svelte']
  },
  module: {
    rules: [
      // Compile our *.svelte files
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: false, // pending https://github.com/sveltejs/svelte/issues/2377
            preprocess: preprocess({
              /* options */
            })
          }
        }
      },
      // Compile *.mjs files from node_modules
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }
      // // Ignore Svelte's index.js files (the index.mjs files will be used instead)
      // {
      //   test: /index\.js$/,
      //   include: /node_modules\\svelte\\internal/,
      //   use: {
      //     loader: 'ignore-loader'
      //   }
      // }
    ]
  },
  devtool: prod ? false : 'source-map'
}
