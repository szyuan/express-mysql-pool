# express-mysql-pool

express middleware for mysql pooling connection
一个能让你更方便连接并操作mysql的express中间件。只使用连接池模式连接mysql，并将连接挂载到request对象上。
（更多数据库连接方式可使用 [express-mysql-connection](https://github.com/szYuan/express-mysql-connection) ）

## 安装 Install
```
npm install express-mysql-pool
```


## 策略 Strategies
使用连接池进行数据库连接，并且使用的连接会在请求响应后自动释放回连接池。 creates pool of connections on an app instance level, and serves a single connection from pool per request. The connections is auto released to the pool at the response end.

## 使用 Usage

### 使用中间件
```
var mysql = require('mysql'); // 需要引入mysql模块
var myConn = require('express-mysql-connection'); //引入本模块
var dbOptions = {
    host: 'localhost',
    user: 'dbuser',
    password: 'password',
    port: 3306,
    database: 'mydb'
} // 数据库配置
var useConnRoutRs = ['/api', '/test']; // 声明需要使用数据库的路径
app.use(useConnRoutRs, myConn(mysql, dbOptions)); // 使用

// 当然你也可以全局使用： 
// app.use(myConn(mysql, dbOptions));
```
### 数据库查询
基本用法
```
app.get('api/foods', function(req, res, next) {
    var sql = 'SELECT * FROM food';
    // 获取连接
    req.getConnection(function(err, conn) {
        if(!err) {
            // 执行sql查询
            conn.query(sql,function(err, sqlResult) {
                if(!err) {
                    // 响应结果
                    res.json(sqlResult);
                }else {
                    throw err;
                }
            });
        }else {
            throw err;
        }
    });
});
```