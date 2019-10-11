<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="toplist">
      <ul>
        <li class="item" v-for="(item ,index) in topList" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{ index + 1 }}</span>
              <span>{{ song.songname }}-{{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getTopList } from "@/api/rank";
import { ERR_OK } from "@/api/config";
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";
import { mapMutations } from "vuex";
import { playlistMixin } from "@/common/js/mixin";

export default {
  name: "Rank",
  mixins: [playlistMixin],
  data() {
    return {
      topList: []
    };
  },
  components: {
    Scroll,
    Loading
  },
  created() {
    this._getTopList();
  },
  methods: {
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    }),
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.rank.style.bottom = bottom;
      this.$refs.toplist.refresh();
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.setTopList(item);
    }
  }
};
</script>
<style scoped lang="stylus">
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'

.rank {
  position: fixed
  top: 88px
  bottom: 0
  width: 100%

  .toplist {
    overflow: hidden
    height: 100%

    .item {
      display: flex
      margin: 0 20px
      padding-top: 20px
      height: 100px

      &:last-child {
        padding-bottom: 20px
      }

      .icon {
        flex: 0 0 100px
        width: 100px
        height: 100px
      }

      .songlist {
        display: flex
        flex: 1
        flex-direction: column
        justify-content: center
        overflow: hidden
        padding: 0 20px
        height: 100
        background: $color-highlight-background
        color: $color-text-d
        font-size: $font-size-small

        .song {
          no-wrap()
          line-height: 26px
        }
      }
    }

    .loading-container {
      position: absolute
      top: 50%
      width: 100%
      transform: translateY(-50%)
    }
  }
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.4s
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0)
}
</style>

  