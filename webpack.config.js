const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
  // 開発用の設定
  mode: 'development',

  resolve: {
    extensions: ['.js', '.ts']
  },

  // エントリポイントとなるコード
  entry: {
    'index': path.resolve(__dirname, 'src/js/index.ts'),
    'style.css': path.resolve(__dirname, 'src/scss/style.scss'),
  },

  // バンドル後の js ファイルの出力先
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'js/[name].js'
  },

  // ソースマップファイルの出力設定
  devtool: 'source-map',

  module: {
    rules: [
      // TypeScript ファイルの処理方法
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },

  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 3000,
    client: {
      overlay: true
    }
  },

  watchOptions: {
    ignored: /node_modules/
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]'
    }),
    // HTML ファイルの出力設定
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};