'use strict';
const ora = require('ora');
const path = require('path');
const rm = require('rimraf');
const chalk = require('chalk');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const packageJson = require('../package.json');
const dllWebpackConfig = require('./webpack.dll');
const baseWebpackConfig = require('./webpack.base');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const htmlWebpackPluginConfig = {
  filename: 'index.html',
  template: './main/index.html',
  favicon: resolve('./main/assets/favicon.ico'),
  inject: true,
  meta: {
    viewport: 'width=device-width,initial-scale=1.0',
    renderer: 'webkit',
    description: '前端',
  },
  title: '前端',
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
  },
};

const CopyAssetsList = [];

process.env.NODE_ENV = '"production"';

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      extract: true,
      usePostCSS: true,
    }),
  },
  output: {
    path: resolve('./dist'),
    filename: 'assets/js/[name].[chunkhash:6].js',
    chunkFilename: 'assets/js/[id].[chunkhash:6].js',
    publicPath: `${packageJson.contentPath}`,
  },
  plugins: [
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash:6].css',
      ignoreOrder: true,
      chunkFilename: 'assets/css/[id].[contenthash:6].css',
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin(htmlWebpackPluginConfig),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin(CopyAssetsList),
    // moment的locale
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    // 自动拷贝至nginx之类
    new utils.CopyDistFilePlugin(),
  ],
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        sourceMap: false,
        terserOptions: {
          compress: {
            pure_funcs: ['console.debug', 'console.log'],
          },
        },
        extractComments: false,
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSAssetsWebpackPlugin({
        cssProcessorOptions: { safe: true },
      }),
    ],
    runtimeChunk: {
      name: 'index',
    },
    splitChunks: {
      cacheGroups: {},
    },
  },
});

// gzip压缩
if (false) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
}

// 分析工具
if (false) {
  webpackConfig.plugins.push(
    new webpackBundleAnalyzer.BundleAnalyzerPlugin({
      analyzerHost: 'localhost',
      analyzerPort: 8088,
      reportFilename: 'report.html',
    }),
  );
}

const spinner = ora('building for production...');
spinner.start();

rm(path.resolve(__dirname, './dist'), async (err) => {
  if (err) throw err;
  // check dll
  await dllWebpackConfig.build();

  webpack(webpackConfig, function (err, stats) {
    spinner.stop();
    // 错误即停止
    if (err) {
      throw err;
    }
    // 合并
    const options = merge(webpackConfig.stats, {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    });
    process.stdout.write(stats.toString(options) + '\n\n');

    // 错误处理
    if (stats.hasErrors()) {
      console.log(chalk.red(`  Build failed with errors:${stats.endTime - stats.startTime}ms.\n`));
      process.exit(1);
    }

    console.log(chalk.cyan(`  Build complete:${stats.endTime - stats.startTime}ms.\n`));
  });
});
