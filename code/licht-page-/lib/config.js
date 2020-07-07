// 设置默认路径
let config = {
  path: {
    src: "src",
    tmp: ".tmp",
    dist: "dist",
    public: "public",
    page: "**.html",
    js: "assets/scripts/*.js",
    css: "assets/styles/*.scss",
    font: "assets/fonts/**",
    image: "assets/images/**",
  },
};

try {
  // 项目文件目录
  const cwd = process.cwd();

  // 读取项目中的 config 文件
  const loadConfig = require(`${cwd}/licht-page.config.js`);

  // 合并 config
  config = Object.assign({}, config, loadConfig);
} catch (e) {}

module.exports = config;
