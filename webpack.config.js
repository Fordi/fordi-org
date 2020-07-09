const { resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['babel-plugin-htm', {
                pragma: 'h',
                tag: 'html',
                import: {
                  module: 'https://unpkg.com/@fordi-org/buildless',
                  export: 'h'
                },
                useNativeSpread: true
              }],
              ['./babel/babel-plugin-css.js'],
              ['./babel/babel-plugin-ununpkg.js', {
                pathMap: {
                  '@fordi-org/buildless': {
                    // Map to the prod version
                    '': 'dist/buildless.prod.modern.js'
                  }
                }
              }],
              ['babel-plugin-minify-constant-folding'],
              ['babel-plugin-minify-dead-code-elimination'],
              ['babel-plugin-minify-flip-comparisons'],
              ['babel-plugin-minify-guarded-expressions'],
              ['babel-plugin-minify-infinity'],
              ['babel-plugin-minify-mangle-names'],
              ['babel-plugin-minify-replace'],
              ['babel-plugin-minify-simplify'],
              ['babel-plugin-minify-type-constructors'],
              ['babel-plugin-transform-member-expression-literals'],
              ['babel-plugin-transform-merge-sibling-variables'],
              ['babel-plugin-transform-minify-booleans'],
              ['babel-plugin-transform-property-literals'],
              ['babel-plugin-transform-simplify-comparison-operators'],
              ['babel-plugin-transform-undefined-to-void']
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: 'src',
        to: '.',
        globOptions: {
          ignore: ['**/*.js']
        }
      }]
    })
  ]
};
