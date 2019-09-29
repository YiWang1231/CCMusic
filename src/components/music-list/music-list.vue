<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      class="list"
      ref="list"
      :data="songs"
      :probeType="probeType"
      :listenScroll="listenScroll"
      @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <songlist :songs="songs" @select="selectSong" :rank="rank"></songlist>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from "@/base/loading/loading";
import SongList from "@/base/song-list/song-list";
import Scroll from "@/base/scroll/scroll";
import { prefixStyle } from "@/common/js/dom";
import { mapActions } from "vuex";
import { getSongVkey } from "@/api/singer";
import { playlistMixin } from "@/common/js/mixin";

const RESERVED_HEIGHT = 40;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  name: "MusicList",
  mixins: [playlistMixin],
  components: {
    loading: Loading,
    songlist: SongList,
    scroll: Scroll
  },
  data() {
    return {
      scrollY: 0
    };
  },
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    back() {
      this.$router.back();
    },
    scroll(pos) {
      // 接受scroll组件抛出的pos参数
      this.scrollY = pos.y;
    },
    selectSong(song, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      });
    },
    random() {
      this.randomPlay({ list: this.songs });
    },
    ...mapActions(["selectPlay", "randomPlay"])
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`;
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  watch: {
    scrollY(newY) {
      // console.log(this.$refs.bgImage.clientHeight);
      // console.log(newY);
      let zIndex = 0;
      let translateY = Math.max(this.minTranslateY, newY);
      let scale = 1;
      let blur = 0;
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;
      const percent = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        zIndex = 10;
        scale = 1 + percent;
      } else {
        blur = Math.min(20 * percent, 20);
      }
      this.$refs.filter.style.backdropFilter = `blur(${blur}px)`;
      // this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
      if (newY < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = `70%`;
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'

.music-list {
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 100
  background: $color-background

  .back {
    position: absolute
    top: 0
    left: 6px
    z-index: 50

    .icon-back {
      display: block
      padding: 10px
      color: $color-theme
      font-size: $font-size-large-x
    }
  }

  .title {
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    color: $color-text
    text-align: center
    font-size: $font-size-large
    line-height: 40px
  }

  .bg-image {
    position: relative
    padding-top: 70%
    width: 100%
    height: 0
    background-size: cover
    transform-origin: top

    .play-wrapper {
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%

      .play {
        box-sizing: border-box
        margin: 0 auto
        padding: 7px 0
        width: 135px
        border: 1px solid $color-theme
        border-radius: 100px
        color: $color-theme
        text-align: center
        font-size: 0

        .icon-play {
          margin-right: 6px
          vertical-align: middle
          font-size: $font-size-medium-x
          dispaly: inline-block
        }

        .text {
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
        }
      }
    }

    .filter {
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
    }
  }

  .bg-layer {
    position: relative
    height: 100%
    background: $color-background
  }

  .list {
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    background: $color-background

    .song-list-wrapper {
      padding: 20px 30px
    }

    .loading-container {
      position: absolute
      top: 50%
      width: 100%
      transform: translateY(-50%)
    }
  }
}
</style>