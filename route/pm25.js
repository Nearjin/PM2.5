const pm = require('../model/pm25')

var all = {
    path: '/api/pm25/all',
    method: 'get',
    func: function(request, response) {
        var all = pm.data
        var r = JSON.stringify(all)
        response.send(r)
    }
}

const routes = [
    all
]

module.exports.routes = routes
