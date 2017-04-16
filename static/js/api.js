//辅助函数
var log = function() {
    console.log.apply(console, arguments)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var appendHtml = function(element, html) {
	element.insertAdjacentHTML('beforeend', html)
}

//定义 toggleClass 函数
var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

// removeClassAll() 删除所有的class
var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}



//功能函数
// ajax函数
var ajax = function(method, path, data, reseponseCallback) {
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    // 设置发送的数据的格式
    r.setRequestHeader('Content-Type', 'application/json')
    // 注册响应函数
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            var t = JSON.parse(r.response)
            reseponseCallback(t)
        }
    }
    // 发送请求
    r.send(data)
}

var api = {}

api.get = (url, callback) => {
    var method = 'GET'
    ajax(method, url, '', callback)
}

api.all = (callback) => {
    var url = '/api/pm25/all'
    api.get(url, (r) => {
        log(r)
        callback(r)
    })
}
