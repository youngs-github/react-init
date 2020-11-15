const utils = require('./utils');
const merge = require('webpack-merge');
const portfinder = require('portfinder');
const dllWebpackConfig = require('./webpack.dll');
const baseWebpackConfig = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const htmlWebpackPluginConfig = {
  filename: 'index.html',
  template: './main/index.html',
  inject: true,
  meta: {
    viewport: 'width=device-width,initial-scale=1.0',
    renderer: 'webkit',
    description: '前端',
  },
  title: '前端',
};

process.env.NODE_ENV = '"development"';

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  // cheap-module-eval-source-map
  devtool: 'eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    hotOnly: true,
    compress: true,
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8080,
    open: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    publicPath: '/',
    // 代理
    proxy: {
      '/api': {
        target: '',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
    quiet: true,
    watchOptions: {
      poll: false,
    },
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      usePostCSS: true,
    }),
  },
  plugins: [new HtmlWebpackPlugin(htmlWebpackPluginConfig)],
});

module.exports = new Promise(async (resolve, reject) => {
  // check dll
  await dllWebpackConfig.build();

  portfinder.basePort = process.env.PORT || devWebpackConfig.devServer.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;
      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
          },
          onErrors: utils.createNotifierCallback(),
        }),
      );
      resolve(devWebpackConfig);
    }
  });
});
