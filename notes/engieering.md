# 前段工程化
遵循一定标准的规范，通过工具提高效率降低成本

### 主要解决的问题
- 传统语言或语法的弊端 (ES6+, Less/Sass/PostCSS)
- 无法使用模块化/组件化
- 重复的机械式工作 (压缩代码及资源文件，上传代码到服务器)
- 代码风格统一、质量保证
- 依赖后端服务接口支持
- 整体依赖后端项目

### 项目中的表现
一切以提高效率、降低成本、质量保证为目的的手段都属于`工程化`

- 创建项目
  - 创建项目结构
  - 创建特定类型文件
- 编码
  - 格式化代码
  - 校验代码风格
  - 编译/构建/打包
- 预览/测试
  - Web Server / Mock (解决后端服务未开发情况下的开发功能)
  - Live Reloading / HMR (热更新)
  - Source Map (定位问题)
- 提交
  - Git Hooks
  - Lint-staged
  - 持续集成
- 部署
  - CI / CD
  - 自动发布

> 工程化!==某个工具

## 脚手架工具
- 相同的组织结构
- 相同的开发范式
- 相同的模块依赖
- 相同的工具配置
- 相同的基础代码

### 常用脚手架工具
根据信息创建对应的项目基础结构
- create-react-app
- vue-cli
- angular-cli
- yeoman 通用型脚手架工具 
- Plop 创建特定类型文件

# Yeoman
### 安装
```
全局安装 yo，安装对应的 generator
npm i yo -g
npm i generator-node -g

通过 yo 运行 generator
cd path/to/project-dir
mkdir module/name
yo node
```

### 使用
- 明确需求
- 找到合适的 generator
- 全局范围安装找到的 generator
- 通过 Yo 运行对应的 generator
- 通过命令行交互填写选项
- 生成所需要的项目结构

# Generator
必须叫 generator-<name>
- generators 生成器目录
  - app 默认生成器目录
    - index.js 默认生成器实现
  - component 其他生成器目录
    - index.js 其他生成器实现
- package.json 模块包配置文件

`yarn add yeoman-generator`
```js
// generators/app/index.js
// 此文件为 Generator 核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用在此类型中定义的一些生命周期方法
// 在这些方法中可以通过调用父类提供的一些工具方法实现一些功能
const Generator = require("yeoman-generator")

module.exports = class extends Generator {
	prompting() {
		// 在询问用户阶段自动调用
		// 可调用父类的 prompt() 方法发出对用户的命令行询问
		return this.prompt([
			{
				type: "input",
				name: "name",
				message: "Your project name",
				default: this.appname, // appname为项目生成目录名称
			},
		]).then(answers => { this.answers = answers })
	}
	writing() {
		// 在生成文件阶段自动调用
		// 通过字符串方式写入文件
		// this.fs.write(
		//   this.destinationPath('temp.txt'),
		//   Math.random().toString()
		// )

		// 通过模版方式写入文件到目标目录
		// 模版文件路径
		// const temp = this.templatePath("foo.txt")
		// 输出目录路径
		// const output = this.destinationPath("foo.txt")
		// 模版数据上下文
		// const context = { title: "hello licht", success: false }

		// const temp = this.templatePath("bar.html")
		// const output = this.destinationPath("bar.html")
		// const context = this.answers
		// this.fs.copyTpl(temp, output, context)

		// 把每一个文件都通过模版转换到目标路径
		const templates = [
			"babel.config.js",
			"package.json",
			"README.md",
			// ...
		]

		templates.forEach(item => {
			// item => 每个文件路径
			this.fs.copyTpl(
				this.templatePath(item),
				this.destinationPath(item),
				this.answers
			)
		})
	}
}
```
链接到全局范围 `yarn link`  
在项目运行生成器 `yo sample`  
在可能发生变化的地方进行替换（例如：`<%= title %>`）
```html
<!-- generators/app/templates/bar.html -->
<!-- 内部可以使用 EJS 模版标记输出数据 -->
<!-- 例如: <%= title %>，<% if (success) { %>哈哈哈<% } %> -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- <%= BASE_URL %> 模版标记会报错，需通过<%%= BASE_URL %>原封不动的输出 -->
	<link rel="icon" href="<%%= BASE_URL %>favicon.ico">
  <title><%= name %></title>
</head>
<body>
  <h1><%= name %></h1>
</body>
</html>
```

## 代码发布
- git init
- git add .
- git commit -m 'Message here'
- 链接 github 仓库 (git remote add origin ...)
- git push -u origin master
- npm/yarn publish 发布

# Plop
创建项目中特定类型的小工具
`yarn add plop -D`

```js
// plopfile.js
// Plop 入口文件，需导出一个函数
// 接收一个 plop 对象，用创建生成器任务
// 使用 generator `yarn plop component`
module.exports = plop => {
	plop.setGenerator("component", {
		description: "create a component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "component name",
				default: "MyComponent",
			},
		],
		actions: [
			{
				type: "add",
				path: "src/components/{{name}}/{{name}}.js",
				templateFile: "plop-templates/component.hbs",
			},
			{
				type: "add",
				path: "src/components/{{name}}/{{name}}.css",
				templateFile: "plop-templates/component.css.hbs",
			},
		],
	})
}
```

```js
// plop-templates/component.hbs
import React from 'react';

export default () => {
  return (
    <div className="{{name}}">
      <h1>{{name}} Component</h1>
    </div>
  )
}
```

```css
/* plop-templates/component.css.hbs */
.{{name}} {}
```

# 脚手架的工作原理
启动后自动询问预设问题，结合模版文件生成项目结构