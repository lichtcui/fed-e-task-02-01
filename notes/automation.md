# 自动化构建
把开发环境写的源代码，自动化的转化成生产环境中运行的代码
自动化构建工作流：使用提高效率的语法规范和标准
- ECMAScript Next
- Sass
- 模版引擎

#### npm script
```json
"scripts": {
  "build": "sass scss/main.scss css/style.css --watch",
  // `pre`: 在 serve 前先进行 yarn build
  // "preserve": "yarn build",
  // browser-sync 启动 web 服务
  "serve": "browser-sync . --files \"css/*.css\"",
  // npm-run-all: 同时执行 build 和 serve
  "start": "run-p build serve"
}
```

#### 常用自动化构建工具
- Grunt  
  生态完善，构建速度较慢
- Gulp  
  构建速度快，基于内存，可同时执行多个任务，生态完善
- FIS  
  适合初学者
> webpack 是模块打包工具

# Grunt
`yarn add grunt`

#### registerTask
```js
// gruntfile.js
// grunt 入口文件，用于定义一些需要 grunt 自动执行的任务
// 需要导出一个函数，接收一个 grunt 的形参，内部提供一些创建任务时用的 api
module.exports = grunt => {
  // yarn grunt foo
  grunt.registerTask('foo', () => { console.log('hello foo~') })

  // 可加描述
  grunt.registerTask('bar', 'task description', () => { console.log('hello bar~') })

  // 默认调用
  grunt.registerTask('default', () => { console.log('default task~') })

  // 默认依次调用任务
  grunt.registerTask('default', ['foo', 'bar'])

  // Grunt 默认支持同步模式，异步操作必须调用 this.async() 来标识完成
  // async fail
  // grunt.registerTask('async-task', () => {
  //   setTimeout(() => { console.log('async task working') }, 1000)
  // })
  grunt.registerTask('async-task', function() {
    const done = this.async()
    setTimeout(() => {
      console.log('async task working')
      done()
    }, 1000)
  })

  // 标记任务失败 return false
  grunt.registerTask('bad', () => {
    console.log('bad working~')
    return false
  })
  // 失败后的任务不再执行
  // yarn grunt --force 强制执行所有任务
  grunt.registerTask('default', ['foo', 'bad', 'bar'])
  // 标记异步任务失败
  grunt.registerTask('bad-async', function() {
    const done = this.async()
    setTimeout(() => {
      console.log('bad async')
      done(false)
    }, 1000)
  })
}
```

#### grunt 配置方法
```js
module.exports = grunt => {
  grunt.initConfig({
    // foo: 'bar'
    foo: { bar: 123 }
  })
  grunt.registerTask('foo', () => {
    // console.log(grunt.config('foo'))
    console.log(grunt.config('foo.bar'))
  })
}
```

#### grunt 多目标任务
执行指定目标 `yarn grunt build:css`
```js
module.exports = grunt => {
  grunt.initConfig({
    // 任务名称同名的属性，此属性必须是一个对象
    build: {
      options: {
        foo: 'bar'
      },
      // 目标中配置options会覆盖外部options
      css: {
        options: {
          foo: 'baz'
        }
      },
      // css: '1',
      js: '2'
    }
  })

  grunt.registerMultiTask('build', function() {
    console.log('options', this.options())
    console.log(`target: ${this.target}`, `data: ${this.data}`)
  })
}
```

#### grunt 插件的使用
`yarn add grunt-contrib-clean`
```js
module.exports = grunt => {
  // 配置 clean
	grunt.initConfig({
		clean: {
      // temp 下所有 txt 文件
      temp: "temp/*.txt",
      // temp 下所有文件
      // temp: "temp/**"
		},
	})

  // 删除文件
	grunt.loadNpmTasks("grunt-contrib-clean")
}
```

#### grunt sass
`yarn add grunt-sass sass -D`
```js
const sass = require('sass')

module.exports = grunt => {
  grunt.initConfig({
    sass: {
      options: {
        sourceMap: true,
        implementation: sass
      },
      main: {
        // 出口文件：入口文件
        files: { 'dist/css/main.css': 'src/scss/main.scss' }
      }
    }
  })
  grunt.loadNpmTasks('grunt-sass')
}
```

#### grunt babel & load-grunt-tasks & grunt-contrib-watch
编译ES6 `yarn add grunt-babel @babel/core @babel/preset-env -D`
文件改变后自动编译 `yarn add load-grunt-tasks -D`
自动加载插件任务 `yarn add grunt-contrib-watch -D`
```js
const loadGruntTasks = require('load-grunt-tasks')

module.exports = grunt => {
  grunt.initConfig({
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      main: {
        files: { 'dist/js/app.js': 'src/js/app.js' }
      }
    },
    watch: {
      js: {
        files: ['src/js/*.js'],
        tasks: ['babel']
      },
      css: {
        files: ['src/scss/*.scss'],
        tasks: ['sass']
      }
    }
  })
  // 自动加载所有的 grunt 插件中的任务
  loadGruntTasks(grunt)
  // 先进行编译，在启动监听
  grunt.registerTask('default', ['babel', 'watch'])
}
```

# Gulp
每个代码都是异步任务  
入口文件: `gulpfile.js`

#### gulp done
```js
// yarn gulp foo
exports.foo = done => {
  console.log('foo task working~')
  // 标识任务完成
  done()
}
// yarn gulp
exports.default = done => {
  console.log('default')
  done()
}

// gulp 4.0 以前，不推荐
const gulp = require('gulp')
gulp.task('bar', done => {
  console.log('bar working~')
  done()
})
```

#### gulp 组合任务
```js
const { series, parallel } = require('gulp')
// 串形任务，依次执行
exports.foo = series(task1, task2, task3)
// 并行任务，同步执行
exports.bar = parallel(task1, task2, task3)
```

#### gulp 异步任务
```js
exports.callback = done => {
  console.log('callback task~')
  // 多任务同时执行的话，后续任务不会执行
  // done(new Error('task failed!'))
  done()
}

exports.promise = () => {
  console.log('promise task~')
  return Promise.resolve()
  // return Promise.reject(new Error('task failed'))
}

const timeout = time => new Promise(resolve => setTimeout(resolve, time))
exports.async = async () => {
  await timeout(1000)
  console.log('async task~')
}

const fs = require('fs')
exports.stream = done => {
  const readStream = fs.createReadStream('package.json')
  const writeStream = fs.createWriteStream('temp.txt')
  readStream.pipe(writeStream)
  return readStream
  // stream 有 end 事件，当读取文件流完成过后触发 end 事件，从而让任务结束
  // 模拟 end 事件
  // readStream.on('end', () => { done() })
}
```

#### gulp 构建过程
读取流（输入） -> 转换流（加工） -> 写入流（输出）
```js
const fs = require("fs")
const { Transform } = require("stream")

exports.default = () => {
	// 文件读取流
	const read = fs.createReadStream("normalize.css")
	// 文件写入流
	const write = fs.createWriteStream("normalize.min.css")
	// 文件转换流
	const transform = new Transform({
		transform: (chunk, encoding, callback) => {
			// 核心转换过程实现
			// chunk => 读取流中读取到的内容（buffer）
			const input = chunk.toString()
			const output = input.replace(/\s+/g, "").replace(/\/\*.+?\*\//g, "")

			// 错误优先，没有错误则传入 null
			callback(null, output)
		},
  })

	// 把读取出来的任务，先转换，再写入文件流
	read.pipe(transform).pipe(write)

	return read
}
```
