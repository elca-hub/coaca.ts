const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const modeEnv = process.env.MODE === 'production' ? 'production' : 'development';

module.exports = {
  // 開発用の設定
  mode: modeEnv,

  resolve: {
    extensions: ['.js', '.ts']
  },

  // エントリポイントとなるコード
  entry: './src/js/index.ts',

  // バンドル後の js ファイルの出力先
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
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
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },

  plugins: [
    // HTML ファイルの出力設定
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin()
  ]
};