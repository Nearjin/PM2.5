// 引入 express 并且创建一个 express 实例赋值给 app
var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.json())

// 配置静态文件目录
app.use(express.static('static'))


const registerRoutes = function(app, routes) {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        // 下面这段是重点
        app[route.method](route.path, route.func)
    }
}

// 导入 route/index 的所有路由数据
const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)

// 导入 route/weather 的所有路由数据
const routePm = require('./route/pm25')
registerRoutes(app, routePm.routes)

var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log(`应用实例，访问地址为 ${host}:${port}`)
})
