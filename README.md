

### webpack配置

- 一个前端资源加载/打包工具
- 使用版本：3.10.0
- yarn add webpack@3.10.0 --dev
- 多个版本 webpack 共存解决方案

需要处理的文件类型

HTML --> html-webpack-plugin

脚本（es6、react） --》 babel + babel-preset-react

样式 --》 css-loader + sass-loader

图片/字体 --》 url-loader + file-loader



webpack 常用模块

- html-webpack-plugin，html 单独打包成文件
- extract-text-webpack-plugin，样式打包成单独文件
- CommonsChunkPlugin，提出通用模块



webpack-dev-server

- 为webpack 项目提供web服务
- 使用版本：2.9.7
- 更改代码自动刷新，路径转发
- yarn add webpack-dev-server@2.9.7 --dev
- 解决多版本共存问题



代码的上线前准备

- 增加上线需要的适配代码
- 提交 pull request
- 将代码合并到master分支



生产环境配置

- 安装Nodejs
- 安装yarn
- 安装git，并配置权限
- 安装nginx



代码发布过程

- 拉取最新master分支的代码
- 项目初始化
- 执行线上环境的打包编译
- 复制dist目录到目标目录



nginx和域名配置

- ngnix中vhost的配置
- 通过指定hosts方式做线上回归测试
- 更改域名解析