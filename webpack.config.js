
const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const styleLoader = (test, modules, sass) => ({
  test,
  use: [
    MiniCssExtractPlugin.loader,
    modules ? {
      loader: 'css-loader',
      options: { importLoaders: 1, modules: true }
    } : 'css-loader',
    ...(sass ? ['sass-loader'] : []),
  ],
});

module.exports = {
  mode: 'development',
  entry: resolve(__dirname, 'src/index.js'),
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader' }],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|eot|ttf|woff2?|docx?|md|svg)$/,
        exclude: '/node_modules/',
        use: [ 'file-loader?name=[name].[ext]' ],
      },
      {
        oneOf: [
          styleLoader(/\.module\.s[ac]ss/i, true, true),
          styleLoader(/\.module\.css$/i, true, false),
          styleLoader(/\.s[ac]ss/i, false, true),
          styleLoader(/\.css$/i, false, false),
        ],
      },
    ],
  },
  resolve: {
    alias: {
      _: resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      xhtml: true,
    }),
    new MiniCssExtractPlugin({filename: "[name].css"}),

  ],
  optimization: {
    concatenateModules: true,
    minimize: true,
    minimizer: [
    new TerserPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      terserOptions: {
        mangle: true,
        ie8: false,
        safari10: false,
        ecma: 2015,
        toplevel: true,
        parse: {},
        compress: {
          passes: 3,
          unsafe_methods: true,
        },
        output: {
          ecma: 2015,
          webkit: false,
          semicolons: false,
        }
      }
    }),
  ],
  },
  output: {
    path: resolve(__dirname, 'dist/'),
    filename: '[name].js',
  },
};
