var express = require('express')
var config = require('./config/index')
const axios = require('axios')
const app = express()
const apiRoutes = express.Router()
app.use('/api', apiRoutes)

// 抓取推荐歌单
app.get('/api/getDiscList', function (req, res) {
    let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        console.log('ok')
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})

app.get('/api/getSongVkey', function (req, res) {
    let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    axios.get(url, {
        headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log("获取失败")
        console.log(e)
    })
})

app.get('/api/getSongLyric', function (req, res) {
    let url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg"
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log("获取失败")
        console.log(e)
    })
})

app.get('/api/getSongList', function (req, res) {
    let url = "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg"
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})

app.use(express.static('./dist'))
var port = config.build.port

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('listenting at http://localhost:' + port + '\n')
})