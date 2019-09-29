<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <!-- background -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <!-- top -->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <!-- middle -->
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <!-- currentLyric 不为None时才将数据传入 -->
          <!-- 数据传入后scroll会调用refresh方法 -->
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                  :class="{'current': currentLineNum === index}"
                >{{ line.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- bottom -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ 'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{ 'active': currentShow === 'lyric' }"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="100%" height="100%" :src="currentSong.image" :class="cdCls" />
        </div>
        <div class="text">
          <h2 class="name">{{ currentSong.name }}</h2>
          <p class="desc">{{ currentSong.singer }}</p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlaylist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio
      :src="songUrl"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "@/common/js/dom";
import ProgressBar from "@/base/progress-bar/progress-bar";
import ProgressCircle from "@/base/progress-circle/progress-circle";
import { shuffle } from "@/common/js/util";
import { playMode } from "@/common/js/config";
import Lyric from "lyric-parser";
import Scroll from "@/base/scroll/scroll";
import { getSongUrl } from "@/common/js/song";
import Playlist from "@/components/playlist/playlist";
import { playerMixin } from "@/common/js/mixin";

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  mixins: [playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      songUrl: "",
      currentLyric: null,
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: ""
    };
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  },
  computed: {
    ...mapGetters(["fullScreen", "playing", "currentIndex"]),
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE"
    }),
    ...mapActions(["savePlayHistory"]),
    showPlaylist() {
      this.$refs.playlist.show();
    },
    middleTouchStart(e) {
      this.touch.initiated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.PageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    middleTouchEnd() {
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          opacity = 1;
          offsetWidth === 0;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          opacity = 1;
          this.currentShow = "cd";
        } else {
          opacity = 0;
          offsetWidth = -window.innerWidth;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.middleL.style[transitionDuration] = `${time}ms`;
    },
    getLyric() {
      this.currentSong
        .getSongLyric()
        .then(lyric => {
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
          // console.log(this.currentLyric);
        })
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        // 循环后的是一个类似数组一样的element 可以根据element[index]取到
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.nextSong();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    nextSong() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        this.loop();
      }
      let index = this.currentIndex + 1;
      if (index === this.playList.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      // 歌曲准备完毕的标志位
      console.log(this.songReady);
      this.songReady = false;
      console.log(this.songReady);
    },
    prevSong() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        this.loop();
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
      // 歌曲准备完毕的标志位
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    error() {
      // 歌曲无法播放也允许点击
      console.log("error");
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval) {
      // 向下取整
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    onProgressBarChange(percent) {
      // audio的 currentTime shi'ke'du'xie
      const currentTime = this.currentSong.duration * percent;
      this.$refs.audio.currentTime = currentTime;
      // 需将数值乘以1000
      this.currentLyric.seek(currentTime * 1000);
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      };

      animations.registerAnimation({
        name: "move",
        animation: animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });

      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      console.log(typeof newSong);
      // console.log(!newSong.id);
      if (newSong.id) {
        this.savePlayHistory(newSong);
      }
      if (newSong.id === oldSong.id || !newSong.id) {
        return;
      }

      if (this.currentLyric) {
        console.log("有歌词 需要删除");
        this.currentLyric.stop();
      }
      // 播放前在添加歌曲播放的URL 提高运算效率
      // 需要将url 从promise对象中获取出来
      getSongUrl(newSong).then(url => {
        this.songUrl = url;
      });

      setTimeout(() => {
        // console.log(this.$refs.audio.error);
        this.songReady = true;
        this.$refs.audio.play();
        this.setPlayingState(true);
        this.getLyric();
      }, 500);
    },
    playing(newPlaying) {
      setTimeout(() => {
        const audio = this.$refs.audio;
        newPlaying ? audio.play() : audio.pause();
      }, 500);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'

.player {
  .normal-player {
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 150
    background: $color-background

    .background {
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      height: 100%
      filter: blur(20px)
      opacity: 0.6
    }

    .top {
      position: relative
      margin-bottom: 25px

      .back {
        position: absolute
        top: 0
        left: 6px
        z-index: 50

        .icon-back {
          display: block
          padding: 9px
          color: $color-theme
          font-size: $font-size-large-x
          transform: rotate(-90deg)
        }
      }

      .title {
        margin: 0 auto
        width: 70%
        text-align: center
        line-height: 40px
        no-wrap()
        color: $color-text
        font-size: $font-size-large
      }

      .subtitle {
        color: $color-text
        text-align: center
        font-size: $font-size-medium
        line-height: 20px
      }
    }

    .middle {
      position: fixed
      top: 80px
      bottom: 170px
      width: 100%
      white-space: nowrap
      font-size: 0

      .middle-l {
        position: relative
        display: inline-block
        padding-top: 80%
        width: 100%
        height: 0
        vertical-align: top

        .cd-wrapper {
          position: absolute
          top: 0
          left: 10%
          width: 80%
          height: 100%

          .cd {
            box-sizing: border-box
            width: 100%
            height: 100%
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%

            &.play {
              animation: rotate 20s linear infinite
            }

            &.pause {
              animation-play-state: paused
            }

            .image {
              position: absolute
              top: 0
              left: 0
              width: 100%
              height: 100%
              border-radius: 50%
            }
          }
        }

        .playing-lyric-wrapper {
          overflow: hidden
          margin: 50px auto 0
          width: 80%
          text-align: center

          .playing-lyric {
            height: 20px
            color: $color-text-l
            font-size: $font-size-medium
            line-height: 20px
          }
        }
      }

      .middle-r {
        display: inline-block
        overflow: hidden
        width: 100%
        height: 100%
        vertical-align: top

        .lyric-wrapper {
          overflow: hidden
          margin: 0 auto
          width: 80%
          text-align: center

          .text {
            color: $color-text-l
            font-size: $font-size-medium
            line-height: 32px

            &.current {
              color: $color-text
            }
          }
        }
      }
    }

    .bottom {
      position: absolute
      bottom: 50px
      width: 100%

      .dot-wrapper {
        text-align: center
        font-size: 0

        .dot {
          display: inline-block
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          vertical-align: middle

          &.active {
            width: 20px
            border-radius: 5px
            background: $color-text-ll
          }
        }
      }

      .progress-wrapper {
        display: flex
        align-items: center
        margin: 0 auto
        padding: 10px 0
        width: 80%

        .time {
          flex: 0 0 30px
          width: 30px
          color: $color-text
          font-size: $font-size-small
          line-height: 30px

          &.time-l {
            text-align: left
          }

          &.time-r {
            text-align: right
          }
        }

        .progress-bar-wrapper {
          flex: 1
        }
      }

      .operators {
        display: flex
        align-items: center

        .icon {
          flex: 1
          color: $color-theme

          &.disable {
            color: $color-theme-d
          }

          i {
            font-size: 30px
          }
        }

        .i-left {
          text-align: right
        }

        .i-center {
          padding: 0 20px
          text-align: center

          .i {
            font-size: 40px
          }
        }

        .i-right {
          text-align: left
        }

        .icon-favourite {
          color: $color-sub-theme
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0

      .top {
        transform: translate3d(0, -100px, 0)
      }

      .bottom {
        transform: translate3d(0, 100px, 0)
      }
    }
  }

  .mini-player {
    position: fixed
    bottom: 0
    left: 0
    z-index: 180
    display: flex
    align-items: center
    width: 100%
    height: 60px
    background: $color-highlight-background

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0
    }

    .icon {
      flex: 0 0 40px
      padding: 0 10px 0 20px
      width: 40px

      img {
        border-radius: 50%

        &.play {
          animation: rotate 10s linear infinite
        }

        &.pause {
          animation-play-state: paused
        }
      }
    }

    .text {
      display: flex
      flex: 1
      flex-direction: column
      justify-content: center
      overflow: hidden
      line-height: 20px

      .name {
        margin-bottom: 2px
        no-wrap()
        color: $color-text
        font-size: $font-size-medium
      }

      .desc {
        no-wrap()
        color: $color-text
        font-size: $font-size-small
      }
    }

    .control {
      flex: 0 0 30px
      padding: 0 10px
      width: 30px

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        color: $color-theme-d
        font-size: 30px
      }

      .icon-mini {
        position: absolute
        top: 0
        left: 0
        font-size: 32px
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0)
  }

  100% {
    transform: rotate(360deg)
  }
}
</style>