const { src, dest } = require("gulp");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
const swig = require("gulp-swig");

const { data, path } = require("./config");
const bs = require("./browserServer");

// 编译src下的文件并导出到指定目录
const compile = (dir, method, destDir) =>
  src(dir, { base: path.src, cwd: path.src }).pipe(method).pipe(dest(destDir));

// 编译后进行热更新
const hotCompile = (dir, method) =>
  compile(dir, method, path.tmp).pipe(bs.reload({ stream: true }));

// 编译Js文件
const script = () =>
  hotCompile(path.js, babel({ presets: [require("@babel/preset-env")] }));

// 编译sass文件
const style = () => hotCompile(path.css, sass({ outputStyle: "expanded" }));

// 编译html文件
const page = () =>
  hotCompile(path.page, swig({ data, defaults: { cache: false } }));

// 不需要热更新
// 编译font及image文件
const font = () => compile(path.font, imagemin(), path.dist);
const image = () => compile(path.image, imagemin(), path.dist);

// 静态文件直接导出
const extra = () =>
  src("**", { base: path.public, cwd: path.public }).pipe(dest(path.dist));

module.exports = { script, style, page, font, image, extra };
