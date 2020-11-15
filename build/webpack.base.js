const path = require('path');
// const utils = require('./utils');
const webpack = require('webpack');
const dllWebpackConfig = require('./webpack.dll');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  context: resolve('./'),
  entry: {
    index: './main/view/index.tsx',
  },
  output: {
    path: resolve('./dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.sass', '.scss', '.less', '.json'],
    alias: {
      main: resolve(`main`),
      utils: resolve(`utils`),
      static: resolve(`static`),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: resolve('./main/assets/image/[name].[hash:8].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: resolve('./main/assets/media/[name].[hash:8].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: resolve('./main/assets/fonts/[name].[hash:8].[ext]'),
        },
      },
    ],
  },
  plugins: [
    // dll文件
    ...Object.keys(dllWebpackConfig.config.entry).map((entry) => {
      return new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: resolve(`./node_modules/.cache/dll-plugin/${entry}.manifest.json`),
      });
    }),
    // 外链脚本，需要时开启
    // new utils.ScriptInjectPlugin(),
  ],
  externals: {
    // 外链，可以放置cdn内容，需要时开启
    // 'react': 'React',
    // 'react-dom': 'ReactDOM',
  },
  stats: {
    warningsFilter: [],
  },
};
