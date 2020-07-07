const del = require("del");
const { path } = require("./config");

// 清空临时目录
// dist 为项目 build 目录
// tmp 为临时文件存放处（需二次编译，优化代码）
const clean = () => del([path.dist, path.tmp]);

module.exports = clean;
