const log = console.log.bind(console)
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

class Pm25 {
    constructor() {
        this.name = ''
        this.value = ''
    }
}

var list = []

// 看有没有缓存 , 有的话就从缓存获取数据
const cachedUrl = function(pageNum, callback) {
    var formData = {
          'page.pageNo': `${pageNum}`,
          'xmlname': '1462259560614'
    }
    var postData = {
        url: 'http://datacenter.mep.gov.cn:8099/ths-report/report!list.action',
        formData: formData
    }
    const path = `data/html/${pageNum}.html`
    const exists = fs.existsSync(path)
    if (exists) {
        var data = fs.readFileSync(path)
        callback(data)
    } else {
      request.post(postData, function(error, response, body){
          if (error === null) {
              // 写入内容
              fs.writeFileSync(path, body)
              callback(body)
          }
      })
    }
}

const dataFromHtml = function(body) {
    // cheerio.load 用来把 HTML 文本解析为一个可以操作的 DOM
    var e = cheerio.load(body)
    var divs = e('.report-table').find('tr')
    var r = []
    for (var i = 1; i < divs.length; i++) {
        var div = divs[i]
        var p = dataFromDiv(div)
        r.push(p)
    }
    // console.log(r)
    return r
}

const dataFromDiv = function(div) {
    var e = cheerio.load(div)
    var pm = new Pm25()
    var name = e('td').eq(2).find('span').text()
    pm.name = name.slice(0, -1)
    pm.value = e('td').eq(3).find('span').text()
    return pm
}

const getAllData = function() {
    var l = []
    for (var i = 1; i <= 13; i++) {
        var p = getPromise(i)
        l.push(p)
    }
    Promise.all(l).then(function(value) {
        console.log('获取成功')
        save()
    })
}

const getPromise = function(pageNum) {
    const p = new Promise(function(resolve, reject) {
        cachedUrl(pageNum, function(body) {
            var data = dataFromHtml(body)
            list = list.concat(data)
            resolve(data)
        })
    })
    return p
}

const save = function() {
    var path = 'data/data.json'
    var r = JSON.stringify(list, null, 2)
    fs.writeFileSync(path, r)
}

getAllData()

const loadData = function() {
    var path = 'data/data.json'
    var d = fs.readFileSync(path)
    d = JSON.parse(d)
    return d
}

const t = {
    data: loadData()
}

module.exports = t
