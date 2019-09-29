import { commonParams, options } from "./config"
import axios from "axios"

export function getSongLyric(songMid) {
    const url = "/api/getSongLyric"

    const data = Object.assign({}, commonParams, {
        songmid: songMid,
        g_tk: 574294020,
        hostUin: 0,
        loginUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        pcachetime: + new Date(), // 时间戳
        format: 'json'
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}