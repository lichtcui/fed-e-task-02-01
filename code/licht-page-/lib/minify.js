const { src, dest } = require("gulp");
const loadPlugins = require("gulp-load-plugins");
const { path } = require("./config");

const plugins = loadPlugins();

// 指定相对于当前工作目录搜索资产文件的位置。可以是字符串或字符串数​​组。
const minify = () =>
  src(path.page, { base: path.tmp, cwd: path.tmp })
    // 合并 tmp 内的文件至 dist，优先从 tmp 中获取，后从根目录获取
    .pipe(plugins.useref({ searchPath: [path.tmp, "."] }))
    // 压缩 js 文件
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    // 压缩 css 文件
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    // 压缩 html 文件
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(dest(path.dist));

module.exports = minify;
