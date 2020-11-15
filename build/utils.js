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
