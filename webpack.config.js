const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

let mode = 'development'
let optimization = {}
if (process.env.NODE_ENV === 'production') {
  mode = 'production'
  optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ],
    splitChunks: {
      chunks: 'all'
    }
  }
}

module.exports = {
  mode: mode,
  output: {
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash].[ext][query]',
    filename: 'js/[name].[fullhash].js',
    chunkFilename: 'js/[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024
          }
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets'),
      api: path.resolve(__dirname, './src/api'),
      componetns: path.resolve(__dirname, './src/components'),
      ui: path.resolve(__dirname, './src/ui')
    },
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.scss', '.css', '*']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[fullhash].css',
      chunkFilename: 'css/[id].[fullhash].css',
      ignoreOrder: false
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  optimization: optimization
}
