import { getSongLyric } from "@/api/song"
import { ERR_OK } from "@/api/config"
import { Base64 } from "js-base64"
import { getSongVkey } from "@/api/singer"

export default class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }

    getSongLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }

        return new Promise((resolve, reject) => {
            getSongLyric(this.mid).then((res) => {
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                } else {
                    reject('np lyric')
                }
            })
        })
    }
}

export function createSong(musicData) {

    return new Song({
        'id': musicData.songid,
        'mid': musicData.songmid,
        'singer': filterSinger(musicData.singer),
        'name': musicData.songname,
        'album': musicData.albumname,
        'duration': musicData.interval,
        'image': `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        'url': ''
    })
}

export function createDiscSong(musicData) {

    return new Song({
        'id': musicData.id,
        'mid': musicData.mid,
        'singer': musicData.singer[0].name,
        'name': musicData.name,
        'album': musicData.album.name,
        'duration': musicData.interval,
        'image': `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
        'url': ''
    })
}

// 临时获取currentSong的播放地址
export function getSongUrl(song) {
    let url = ""
    url = getSongVkey(song.mid).then(res => {
        if (res.code === ERR_OK) {
            let temp_url = res.req_0.data.midurlinfo[0].purl;
            return temp_url ? `http://ws.stream.qqmusic.qq.com/${temp_url}` : ""
        }
    })
    return url
}

function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}

