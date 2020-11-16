const fs = require('fs');
const path = require('path');
const packageConfig = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

exports.cssLoaders = function (options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  };
  const px2remLoader = {
    loader: 'px2rem-loader',
    // options here
    options: {
      remUnit: 80,
    },
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, px2remLoader, postcssLoader] : [cssLoader, px2remLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders);
    } else {
      return ['style-loader'].concat(loaders);
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders('css'),
    less: generateLoaders('less', {
      lessOptions: {
        javascriptEnabled: true,
      },
    }),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = [];
  const loaders = exports.cssLoaders(options);
  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader,
    });
  }
  return output;
};

exports.createNotifierCallback = function () {
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') {
      return;
    }
    const error = errors[0];

    const filename = error.file && error.file.split('!').pop();
    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png'),
    });
  };
};

/**
 * 外链脚本插入插件
 * 前置要求：html模板匹配位置
 * @param scripts scripts: Array<Script>
 * @param pattern pattern: String
 */
exports.ScriptInjectPlugin = function (scripts, pattern = '{{scripts}}') {
  scripts = scripts || [
    {
      path: './assets/script/axios.min.js',
      defer: false,
    },
  ];
  // 生成脚本script
  function generate() {
    return scripts
      .map(function (sciprt) {
        return `<script src="${sciprt.path}"${sciprt.defer ? ' defer' : ''}></script>`;
      })
      .join('\n');
  }
  return {
    apply(compiler) {
      compiler.hooks.compilation.tap('ScriptInjectPlugin', function (compilation) {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('ScriptInjectPlugin', function (data, callback) {
          callback(null, (data.html = data.html.replace(pattern, generate())) && data);
        });
      });
    },
  };
};

/**
 * 自定义文件拷贝插件
 * @param dst: String 目标文件夹
 */
exports.CopyDistFilePlugin = function (dst = 'D:\\nginx-1.14.2\\html\\haiyan-front-1') {
  // 删除文件夹
  function deleteDir(path) {
    return new Promise(function (resolve, reject) {
      fs.rmdir(
        path,
        {
          force: true,
          recursive: true,
        },
        function (error) {
          if (error) {
            return reject(error);
          }
          return resolve();
        },
      );
    });
  }
  // 拷贝文件夹
  function copyDir(src, dst) {
    return new Promise(function (resolve, reject) {
      // 任务列表: src(源路径), dst(目标路径), dir(是否文件夹)
      const todos = [
        {
          src: src,
          dst: dst,
          dir: true,
        },
      ];
      // 遍历
      try {
        while (todos.length) {
          const todo = todos.shift();
          // 类型
          if (todo.dir) {
            // 新建
            fs.mkdirSync(todo.dst);
            // 读取
            const files = fs.readdirSync(todo.src);
            // 存储
            todos.push(
              ...files.map((file) => ({
                src: todo.src + '\\' + file,
                dst: todo.dst + '\\' + file,
              })),
            );
          } else if (todo.dir === false) {
            // 文件
            const readStream = fs.createReadStream(todo.src);
            const writeStream = fs.createWriteStream(todo.dst);
            readStream.pipe(writeStream);
          } else {
            // 检查该文件/文件夹
            const stats = fs.statSync(todo.src);
            if (stats.isDirectory()) {
              todos.unshift({
                src: todo.src,
                dst: todo.dst,
                dir: true,
              });
            } else {
              todos.unshift({
                src: todo.src,
                dst: todo.dst,
                dir: false,
              });
            }
          }
        }
        return resolve();
      } catch (e) {
        return reject(e);
      }
    });
  }

  return {
    apply(compiler) {
      // 注册
      compiler.hooks.done.tap('CopyDistFilePlugin', async function (compilation) {
        // 删除源文件
        try {
          await deleteDir(dst);
          console.info('删除源文件成功！');
        } catch (e) {
          console.error('删除源文件异常：', e);
        }
        // 拷贝新文件
        try {
          await copyDir(path.resolve(__dirname, '../dist'), dst);
          console.info('拷贝新文件成功！');
        } catch (e) {
          console.error('拷贝新文件异常：', e);
        }
        console.log();
      });
    },
  };
};
