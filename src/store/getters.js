// 获取数据
export const singer = state => state.singer
// 是不在播放状态
export const playing = state => state.playing
// 是否全屏播放
export const fullScreen = state => state.fullScreen
// 播放列表
export const playList = state => state.playList
// 顺序列表 
export const sequenceList = state => state.sequenceList
// 播放模式
export const mode = state => state.mode
// 当前的索引
export const currentIndex = state => state.currentIndex
// 当前播放歌曲
export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {}
}
// 当前歌单
export const disc = state => state.disc
// 当前的toplist
export const topList = state => state.topList

// 搜索历史
export const searchHistory = state => state.searchHistory

// 播放历史
export const playHistory = state => state.playHistory