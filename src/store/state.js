import { playMode } from "@/common/js/config"
import { loadSearch } from "@/common/js/cache"
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
    playHistory: []
}

export default state