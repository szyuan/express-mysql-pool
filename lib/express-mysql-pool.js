var _pool, // Pool singleton
    _middlewareFn; 

module.exports = function (mysql, dbConfig) {

    if (null == mysql) throw new Error('Missing mysql module param!');
    if (null == dbConfig) throw new Error('Missing dbConfig module param!');
    // 创建连接池
    _pool = mysql.createPool(dbConfig);
    // 返回中间件 * * * * * * * * * * * * * * * *
    return function(req, res, next) {
        var poolConn = null;
        // Returning cached connection from a pool, caching is on request level
        if(req.__expressMysqlConnectionCache__) {
            req.getConnection = function (callback) {
                pollConn = req.__expressMysqlConnectionCache__;
                callback(null, poolConn);
            }
        }else {
        // Getting connection from a pool
            req.getConnection = function (callback) {
                _pool.getConnection(function (err, connection) {
                    if (err) return callback(err);
                    poolConn = req.__expressMysqlConnectionCache__ = connection;
                    callback(null, poolConn);
                });
            }
        }
        closeConnection(res, poolConn);
        next();
    };
}


function closeConnection(res, poolConnection) {
    // Request closed unexpectedly.
    res.on("close", closeHandler);
    // Finish
    res.on("finish", closeHandler);

    function closeHandler() {
		if (poolConnection) {
            poolConnection.release();
        }
    }
}