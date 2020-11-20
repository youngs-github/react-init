const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const dll_path = resolve('./node_modules');
const dll_paths = ['/.cache', '/dll-plugin'];

const dllConfig = {
  mode: 'none',
  entry: {
    base: ['axios'],
    react: ['react', 'react-dom', 'react-hot-loader', 'react-router', 'react-router-dom'],
    mobx: ['mobx', 'mobx-react'],
    redux: ['redux', 'redux-thunk', 'react-redux'],
    echarts: ['echarts', 'lodash', 'moment', 'cytoscape', 'd3-force'],
  },
  output: {
    path: `${dll_path}${dll_paths.join('')}`,
    filename: '[name].dll.js',
    library: '[name]_library',
  },
  plugins: [
    new webpack.DllPlugin({
      path: `${dll_path}${dll_paths.join('')}/[name].manifest.json`,
      name: '[name]_library',
    }),
  ],
};

module.exports = {
  /**
   * 构建操作
   * 1、检测/.cache/dll-plugin文件夹下版本文件
   * 2、构建
   */
  build: function () {
    // 是否更新
    let latest = false;
    // 入口文件
    const entries = dllConfig.entry;
    // 计时
    const startTime = Date.now();
    // 检测是否存在
    return new Promise(async function (resolve, reject) {
      // 检测目录
      let dp = dll_path;
      for (let p of dll_paths) {
        dp = path.join(dp, p);
        // 是否存在
        const exist = await new Promise((resolve) => {
          fs.stat(dp, (error) => {
            // 取消异常操作
            if (error) return resolve(false);
            resolve(true);
          });
        });
        if (!exist) {
          await new Promise((resolve, reject) => {
            fs.mkdir(dp, (error) => {
              if (error) {
                console.log(chalk.red('DLL插件-新建文件夹异常！'));
                return reject(error);
              }
              resolve();
            });
          });
        }
      }
      // 统计当前版本
      const curVersions = {};
      Object.keys(entries).forEach((key) => {
        const entVersions = (curVersions[key] = {});
        entries[key].forEach((pkgName) => {
          const pkg = require(`${pkgName}/package.json`);
          entVersions[pkgName] = pkg.version;
        });
      });
      // 查找版本文件
      try {
        const string = await new Promise((resolve, reject) => {
          fs.readFile(path.join(dp, 'versions.json'), 'utf-8', (error, data) => {
            if (error) return reject(error);
            resolve(data);
          });
        });
        const preVersions = JSON.parse(string);
        // 检测版本
        latest = Object.keys(curVersions).every((key) => {
          return (
            preVersions[key] &&
            Object.keys(curVersions[key]).every((pkgName) => {
              return preVersions[key][pkgName] === curVersions[key][pkgName];
            })
          );
        });
      } catch (e) {
        // 版本文件不存在，写入
        await new Promise((resolve, reject) => {
          fs.writeFile(path.join(dp, 'versions.json'), JSON.stringify(curVersions), { encoding: 'utf-8' }, (error) => {
            if (error) {
              console.log(chalk.red('DLL插件-新建版本文件异常！'));
              return reject(error);
            }
            resolve();
          });
        });
      }
      // 最新版本
      if (latest) {
        return resolve();
      }
      // 包含旧版本
      webpack(dllConfig, function (err, stats) {
        if (err) return reject(err);
        resolve();
      });
    }).then(() => {
      // 完成
      console.log(chalk.cyan(`DLL 构建完成，耗时：${Date.now() - startTime}ms`));
      console.log();
    });
  },
  /**
   * 配置项，供外部使用
   */
  config: dllConfig,
};
