'use strict';

const webpack = require('webpack');
const glob = require('glob');
const autoprefixer = require('autoprefixer');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const __dist = __dirname + '/../dist';
const __js = __dirname + '/js';
const __modules = __dirname + '/../node_modules';
const __sass = __dirname + '/sass/default';
const __images = __dirname + '/sass/default/img';
const publicPath = '../';
const basePath = '/';

module.exports = function (env) {
  return {
    entry: {
      'js/app': __js + '/main.js',
      'js/vendor' : [
        __modules + '/jquery/dist/jquery.js'
      ],
      'css/style': [
        __sass + '/import.scss'
      ],
      // 'css/vendor-style': [
      //   __modules + '/fontello/fontello-codes.css'
      // ]
    },
    output: {
      path: __dist,
      filename: '[name].bundle.js',
      sourceMapFilename: '[name].map'
    },
    devtool: 'cheap-module-source-map',
    watch: true,
    watchOptions: {
      poll: 500 // decrese the value if the watcher is slowly (value is in milliseconds)
    },
    module: {
      rules: [{
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        }),
        exclude: __modules
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
        // exclude: __dirname + '/src'
      }, {
        test: /\.[ot]tf$/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          name: './fonts/[name].[ext]',
          publicPath: publicPath
        }
      }, {
        test: /\.woff$/,
        loader: 'url-loader?mimetype=application/font-woff',
        options: {
          limit: 65000,
          name: './fonts/[name].[ext]',
          publicPath: publicPath
        }
      }, {
        test: /\.woff2$/,
        loader: 'url-loader?mimetype=application/font-woff2',
        options: {
          limit: 65000,
          name: './fonts/[name].[ext]',
          publicPath: publicPath
        }
      }, {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'file-loader',
        options: {
          name: __images + '/[name].[ext]',
          publicPath: publicPath
        }
      }, {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
              loader: 'babel-loader',
              options: {
                  presets: ['es2015']
              }
          }
      }]
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: __images,
        to: __dist + '/img'
      }]),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [autoprefixer()]
        }
      }),
      new ExtractTextPlugin('[name].bundle.css'), new ManifestPlugin({
        basePath: basePath
      }),
      new WebpackShellPlugin({
        onBuildExit: [
          'npm run finish'
        ]
      })
    ],
    devServer: {
      contentBase: __dist,
      compress: true,
      port: 9000
    }
  };
};
