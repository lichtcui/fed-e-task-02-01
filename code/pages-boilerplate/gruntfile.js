const sass = require("sass");
const loadGruntTasks = require("load-grunt-tasks");

module.exports = (grunt) => {
  // 配置
  grunt.initConfig({
    // 配置 clean 任务
    // 清理临时文件夹
    clean: ["dist", ".tmp/**"],
    // 配置 sass 任务
    sass: {
      options: {
        // 启用 sourceMap
        sourceMap: true,
        implementation: sass,
      },
      // 指定输入输出文件
      main: {
        files: [
          {
            expand: true,
            cwd: "src/assets/styles/",
            src: ["*.scss"],
            dest: "dist/assets/styles",
            ext: ".css",
          },
        ],
      },
    },
    // 配置 babel 任务
    babel: {
      options: {
        sourceMap: true,
        presets: ["@babel/preset-env"],
      },
      main: {
        files: [
          {
            expand: true,
            cwd: "src/assets/scripts/",
            src: ["*.js"],
            dest: "dist/assets/scripts",
            ext: ".js",
          },
        ],
      },
    },
    // 配置 watch 任务
    // 当指定文件发生变化后执行指定任务
    watch: {
      js: {
        files: ["src/assets/scripts/*.js"],
        tasks: ["babel"],
      },
      css: {
        files: ["src/assets/styles/*.scss"],
        tasks: ["sass"],
      },
    },
  });

  // 自动加载所有的 grunt 插件中的任务
  loadGruntTasks(grunt);

  // 先进行编译，在启动监听
  grunt.registerTask("default", ["clean", "sass", "babel", "watch"]);
};
