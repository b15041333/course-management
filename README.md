### 准备工作

1. 安装mongodb数据库
2. 安装node环境
3. 安装项目所需的依赖：npm install

### 启动

1. 启动mongodb数据库服务器：

   在mongodb安装目录下新建data文件夹，在data下新建db子文件夹，作为数据库的存放地址。

   mongod --dbpath mongodb安装目录/data/db

   比如：mongod --dbpath D:\mongodb-win32-x86_64-2012plus-4.2.5\data\db

   当然，执行mongod指令，需要先将/bin目录添加到环境变量中。

2. 启动项目:

   node app.js

3. 浏览器访问：localhost:5000/

### 项目上传时间

2020/3/31