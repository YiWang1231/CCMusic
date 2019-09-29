import { commonParams, options } from "./config"
import jsponp from "@/common/js/jsonp"
import axios from "axios"

export function getHotKey() {
    const url = "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg"

    const data = Object.assign({}, commonParams, {
        uin: 0,
        format: 'json',
        platform: 'h5',
        needNewCode: 1
    })

    return jsponp(url, commonParams, options)
}

export function search(query, page, zhida, perpage) {
    const url = "https://c.y.qq.com/soso/fcgi-bin/client_search_cp"
    const data = Object.assign({}, commonParams, {
        w: query,
        p: page,
        n: perpage,
        platform: 'yqq',
        needNewCode: 0,
        remoteplace: 'txt.yqq.song',
        t: 0,
        aggr: 1,
        cr: 1,
        catZhida: zhida ? 1 : 0
    })

    return jsponp(url, data, options)
}