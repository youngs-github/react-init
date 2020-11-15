const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const dll_path = resolve('./node_modules/.cache/dll-plugin');

const dllConfig = {
  mode: 'none',
  entry: {
    base: ['axios'],
    react: ['react', 'react-dom', 'react-hot-loader', 'react-router', 'react-router-dom'],
    mobx: ['mobx', 'mobx-react'],
    redux: ['redux', 'redux-thunk', 'react-redux'],
  },
  output: {
    path: dll_path,
    filename: '[name].dll.js',
    library: '[name]_library',
  },
  plugins: [
    new webpack.DllPlugin({
      path: `${dll_path}/[name].manifest.json`,
      name: '[name]_library',
    }),
  ],
};

module.exports = {
  build: function () {
    // 检测是否存在
    return new Promise(function (resolve, reject) {
      try {
        const stats = fs.statSync(dll_path);
        if (stats.isDirectory()) {
          const files = fs.readdirSync(dll_path);
          const ok = Object.keys(dllConfig.entry).every((e) => files.includes(`${e}.manifest.json`));
          if (ok) {
            console.log(chalk.cyan(`  Build dll is OK !`));
            console.log();
            return resolve();
          }
        }
      } catch (e) {
        // 静默
      }

      // 生成
      webpack(dllConfig, function (err, stats) {
        if (err) return reject(err);
        // 完成
        console.log(chalk.cyan(`  Build dll complete:${stats.endTime - stats.startTime}ms.\n`));
        return resolve();
      });
    });
  },
  config: dllConfig,
};
