const { parallel, series } = require("gulp");
const loaders = require("./loaders");
const clean = require("./clean");
const minify = require("./minify");
const devServer = require("./devServer");

// js, sass, html 文件同步进行
const compile = parallel(loaders.script, loaders.style, loaders.page);

// compile 后才可进行 minify
// build 需要先清空 dist 及 tmp 目录
// 在compile 后编译font，image，及 extra 文件的编译
const build = series(
  clean,
  parallel(series(compile, minify), loaders.font, loaders.image, loaders.extra)
);

// dev 需要在 compile 后开启 browserServer
const dev = series(compile, devServer);

module.exports = { clean, build, dev };
