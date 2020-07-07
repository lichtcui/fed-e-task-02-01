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
		]).then(answers => {
			this.answers = answers
		})
	}

	// 在生成文件阶段自动调用
	writing() {
		// 把每一个文件都通过模版转换到目标路径
		const templates = [
			".gitignore",
			"package.json",
			"README.md",
			"public/favicon.ico",
			"public/index.html",
			"public/logo192.png",
			"public/logo512.png",
			"public/manifest.json",
			"public/robots.txt",
			"src/App.css",
			"src/App.js",
			"src/App.test.js",
			"src/index.css",
			"src/index.js",
			"src/logo.svg",
			"src/serviceWorker.js",
			"src/setupTests.js",
		]

		templates.forEach(item => {
			// 模版文件路径
			const temp = this.templatePath(item)
			// 输出目录路径
			const output = this.destinationPath(item)
			// 模版数据上下文
			const context = this.answers

			// 通过模版方式写入文件到目标目录
			this.fs.copyTpl(temp, output, context)
		})
	}
}
