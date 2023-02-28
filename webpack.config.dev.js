/*
    ./webpack.config.js
*/
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const NODE_ENV = "development"


var APP_DIR = path.resolve(__dirname);
var BUILD_DIR = path.resolve(__dirname,  'build/');
var devbuild = path.resolve(__dirname,  'devbuild/');


module.exports = {
  stats: 'errors-only',
  mode: 'development',
  entry: {
    main: APP_DIR + '/index.js',
  },
  output: {
    publicPath: '/',
    clean: true,
    pathinfo: true,
    path: devbuild,
    filename: "[name].bundle.js"

  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                /*  modifyVars: {
                   '@ant-theme-file': "; @import '" + path.resolve(__dirname, './client/src/fci/assets/css/index.less',) + "'",
                 }, */
                javascriptEnabled: true
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: () => [require("autoprefixer")]
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/react']
          }
        }
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/react']
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/react']
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[ext]',
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name(resourcePath, resourceQuery) {
            return 'images/[name].[ext]';
          },
        },
      },
      {
        exclude: /node_modules/,
        test: /\.js/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  },

  optimization: {
    splitChunks: false,
    minimizer: [
      new UglifyJsPlugin({
        parallel: 10,
        test: /\.js($|\?)/i,
        sourceMap: true,
        uglifyOptions: {
          warnings: false,
          keep_fnames: false
        },
      })
    ]
  },
  devServer: {
    historyApiFallback:true,
    allowedHosts: 'all',
    port: 5000,
    liveReload: true,
    server: 'https',
    client: {
      overlay: true,
    },
    onListening: function (devServer) {
      const port = devServer.server.address().port;

      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      console.log("---------------------- WEBPACK DEVELOPMENT CONFIG------------------")
      console.table({
        port,
        environment: NODE_ENV,
        appDirectory: APP_DIR,
        buildDirectory: BUILD_DIR
      })
      console.log("---------------------- WEBPACK DEVELOPMENT CONFIG ------------------")



    },
  }



};