import storage from "good-storage"

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 100

const LIKE_KEY = '__like__'
const LIKE_MAX_LENGTH = 100

// 数组array操作
// 按照index删除 arr.splice(index, 1)
// 添加到第一个 arr.unshift()
// 删除最后一个元素 arr.pop
function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare)
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    // unshift 插入到第一个元素
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) {
        // pop删除列表最后一个元素
        arr.pop()
    }
}

function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

export function saveLike(song) {
    let songs = storage.get(LIKE_KEY, [])
    insertArray(songs, song, (item) => {
        return item.id === song.id
    }, LIKE_MAX_LENGTH)
    storage.set(LIKE_KEY, songs)
    return songs
}


export function savePlay(song) {
    let playHistory = storage.get(PLAY_KEY, [])
    insertArray(playHistory, song, (item) => {
        return item.id === song.id
    }, PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY, playHistory)
    return playHistory
}

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])

    deleteFromArray(searches, (item) => {
        return item === query
    })

    storage.set(SEARCH_KEY, searches)

    return searches
}

export function unLike(song) {
    let songs = storage.get(LIKE_KEY, [])
    deleteFromArray(songs, (item) => {
        return item.id === song.id
    })
    storage.set(LIKE_KEY, songs)
    return songs
}

export function clearSearch() {
    return storage.set(SEARCH_KEY, [])
}

export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

export function loadPlay() {
    return storage.get(PLAY_KEY, [])
}

export function loadLike() {
    return storage.get(LIKE_KEY, [])
}