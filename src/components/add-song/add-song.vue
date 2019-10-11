<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag">
      <div class="header">
        <span class="text">添加歌曲播放列表</span>
        <span class="close" @click="hide">
          <i class="icon-close"></i>
        </span>
      </div>
      <div class="search-box-wrapper">
        <searchBox ref="searchBox" @query="onQueryChange"></searchBox>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll class="list-scroll" v-if="currentIndex===0" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll" v-if="currentIndex===1" :data="searchHistory">
            <div class="list-inner">
              <search-history
                :searches="searchHistory"
                @select="addQuery"
                @delete="deleteSearchHistory"
              ></search-history>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest
          :query="query"
          :showSinger="showSinger"
          @listScroll="blurInput"
          @select="selectSuggest"
        ></suggest>
      </div>
      <topTip ref="topTip">
        <div class="tipTitle">
          <i class="icon-ok"></i>
          <span class="text">添加歌曲成功</span>
        </div>
      </topTip>
    </div>
  </transition>
</template>
<script>
import searchBox from "@/base/search-box/search-box";
import Suggest from "@/components/suggest/suggest";
import { searchMixin } from "@/common/js/mixin";
import Switches from "@/base/switches/switches";
import SearchHistory from "@/base/search-history/search-history";
import Scroll from "@/base/scroll/scroll";
import SongList from "@/base/song-list/song-list";
import { mapGetters, mapActions } from "vuex";
import Song from "@/common/js/song";
import topTip from "@/base/top-tip/top-tip";
export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [
        {
          name: "最近播放"
        },
        {
          name: "搜索历史"
        }
      ]
    };
  },
  components: {
    searchBox,
    Suggest,
    Switches,
    SearchHistory,
    Scroll,
    SongList,
    topTip
  },
  methods: {
    hide() {
      this.showFlag = false;
    },
    show() {
      this.showFlag = true;
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song, index) {
      // 当前播放歌曲 肯定和最近播放列表中第一首歌相同
      if (index !== 0) {
        // 传入的song并不是song的实例 而仅仅是一个对象
        this.insertSong(new Song(song));
        this.showTip();
      }
    },
    showTip() {
      this.$refs.topTip.show();
    },
    selectSuggest() {
      this.saveSearch();
      this.showTip();
    },
    ...mapActions(["insertSong"])
  },
  computed: {
    ...mapGetters(["playHistory"])
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'

.add-song {
  position: fixed
  top: 0
  bottom: 0
  z-index: 200
  width: 100%
  background: $color-background

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.4s
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(0, 100%, 0)
  }

  .header {
    line-height: 44px

    .text {
      position: absolute
      right: 10%
      width: 80%
      no-wrap()
      text-align: center
      font-size: $font-size-large
    }

    .close {
      position: absolute
      top: 0
      right: 12px

      .icon-close {
        display: blcok
        padding: 10px
        color: $color-theme
        font-size: $font-size-large
      }
    }
  }

  .search-box-wrapper {
    margin: 50px 20px 20px
  }

  .shortcut {
    .list-wrapper {
      position: absolute
      top: 165px
      bottom: 0
      width: 100%

      .list-scroll {
        overflow: hidden
        height: 100%

        .list-inner {
          padding: 20px 30px
        }
      }
    }
  }

  .tipTitle {
    padding: 18px 0
    text-align: center

    .icon-ok {
      margin-right: 4px
      color: $color-theme
      font-size: $font-size-medium
    }

    .text {
      color: $color-theme
      font-size: $font-size-medium
    }
  }
}
</style>