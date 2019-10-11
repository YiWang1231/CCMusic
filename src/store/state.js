import { playMode } from "@/common/js/config"
import { loadSearch, loadPlay, loadLike } from "@/common/js/cache"
// 共享状态
const state = {
    singer: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    mode: playMode['sequence'],
    currentIndex: -1,
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
    playHistory: loadPlay(),
    likeList: loadLike()
}

export default state