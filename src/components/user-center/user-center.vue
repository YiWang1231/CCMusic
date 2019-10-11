<template>
  <transition name="silde">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switch-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      </div>
      <div class="playBtn" @click="playRandom">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll class="list-scroll" v-if="currentIndex===0" :data="likeList" ref="like">
          <div class="list-inner">
            <song-list :songs="likeList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" v-if="currentIndex===1" :data="playHistory" ref="history">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div
        class="no-result-wrapper"
        v-show=" currentIndex===0 && !likeList.length || currentIndex ===1 &&!playHistory.length"
      >
        <noresult :title="noResultDesc"></noresult>
      </div>
    </div>
  </transition>
</template>
<script>
import Switches from "@/base/switches/switches";
import Scroll from "@/base/scroll/scroll";
import { mapGetters, mapActions } from "vuex";
import SongList from "@/base/song-list/song-list";
import Song from "@/common/js/song";
import { playlistMixin } from "@/common/js/mixin";
import NoResult from "@/base/no-result/no-result";
export default {
  name: "UserCenter",
  mixins: [playlistMixin],
  data() {
    return {
      switches: [
        {
          name: "我喜欢的"
        },
        {
          name: "最近播放"
        }
      ],
      currentIndex: 0
    };
  },
  components: {
    Switches,
    Scroll,
    SongList,
    noresult: NoResult
  },
  methods: {
    ...mapActions(["randomPlay", "selectPlay", "insertSong"]),
    handlePlaylist(playlist) {
      const bottom = playlist.length ? "60px" : "";
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.likeList && this.$refs.likeList.refresh();
      this.$refs.playHistory && this.$refs.playHistory.refresh();
    },
    back() {
      this.$router.back();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song) {
      this.insertSong(new Song(song));
    },
    playRandom() {
      let list = this.currentIndex === 0 ? this.likeList : this.playHistory;
      if (list.length === 0) {
        return;
      }
      // 类似于 forEach 但是直接对全部元素实施方法
      list = list.map(song => {
        return new Song(song);
      });
      this.randomPlay({ list });
    }
  },
  computed: {
    ...mapGetters(["playHistory", "likeList"]),
    noResultDesc() {
      if (this.currentIndex === 0) {
        return "暂无收藏歌曲";
      } else {
        return "没有听过歌曲";
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable'

.user-center {
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  background: $color-background

  .back {
    position: absolute
    top: 10px
    left: 6px
    z-index: 50

    .icon-back {
      color: $color-theme
      font-size: $font-size-large-x
    }
  }

  .switch-wrapper {
    margin: 10px auto
  }

  .playBtn {
    box-sizing: border-box
    margin: 30px auto 10px
    padding: 7px 0
    width: 135px
    border: 1px solid $color-text-l
    border-radius: 100px
    color: $color-text-l
    text-align: center

    .icon-play {
      display: inline-block
      margin-right: 5px
      vertical-align: center
      font-size: $font-size-small-s
    }

    .text {
      display: inline-block
      vertical-align: center
      font-size: $font-size-small
    }
  }

  .list-wrapper {
    position: absolute
    top: 125px
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

  .no-result-wrapper {
    position: absolute
    top: 50%
    width: 100%
    transform: translateY(-50%)
  }
}
</style>