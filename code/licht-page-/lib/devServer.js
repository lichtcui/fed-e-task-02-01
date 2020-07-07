const bs = require("./browserServer");
const { watch } = require("gulp");
const { style, script, page } = require("./loaders");
const { path } = require("./config");

// 监听 src 下的文件，并进行相应操作
const watchFile = (path, process) => watch(path, { cwd: path.src }, process);

const serve = () => {
  // 监听 css 文件，变化后进行编译
  watchFile(path.css, style);
  // 监听 js 文件，变化后进行编译
  watchFile(path.js, script);
  // 监听 html 文件，变化后进行编译
  watchFile(path.page, page);
  // 监听 image & font 文件，变化后刷新
  watchFile([path.image, path.font], bs.reload);
  // 监听 public 文件，变化后刷新
  watch("**", { cwd: path.public }, bs.reload);

  // 初始化服务器
  bs.init({
    notify: false, // 关闭提示
    port: 3030, // 端口号
    server: {
      // 一级一级向下查询文件
      baseDir: [path.tmp, path.dist, path.public],
      // alias routes
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

module.exports = serve;
