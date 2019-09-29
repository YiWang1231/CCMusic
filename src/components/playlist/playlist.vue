<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" ref="listContent">
          <transition-group name="list" tag="ul">
            <li
              ref="listItem"
              class="item"
              v-for="(song, index) in sequenceList"
              :key="song.id"
              @click="selectItem(song, index)"
            >
              <i class="current" :class="getCurrentIcon(song)"></i>
              <span class="text">{{ song.name }}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(song)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click.stop="hide">
          <span>关闭</span>
        </div>
        <confirm ref="confirm" text="是否清空播放列表" @confirm="deleteAll"></confirm>
        <addSong ref="addSong"></addSong>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapActions } from "vuex";
import Scroll from "@/base/scroll/scroll";
import { playMode } from "@/common/js/config";
import Confirm from "@/base/confirm/confirm";
import { shuffle } from "@/common/js/util";
import { playerMixin } from "@/common/js/mixin";
import addSong from "@/components/add-song/add-song";
export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    };
  },
  components: {
    Scroll,
    Confirm,
    addSong
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.random
        ? "随机播放"
        : "单曲循环";
    }
  },
  methods: {
    deleteOne(song) {
      console.log(song);
      this.deleteSong(song);
      if (!this.playList.length) {
        this.hide();
      }
    },
    deleteAll() {
      this.deleteList();
      this.hide();
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    showAddSong() {
      this.$refs.addSong.show();
    },
    hide() {
      this.showFlag = false;
    },
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      });
    },
    getCurrentIcon(song) {
      if (this.currentSong.id === song.id) {
        return "icon-play";
      } else {
        return;
      }
    },
    selectItem(song, index) {
      // 如果是随机播放模式则需要获取该歌曲在随机播放列表中的位置
      if (this.mode === playMode.random) {
        index = this.playList.findIndex(item => {
          return item.id === song.id;
        });
      }
      this.setCurrentIndex(index);
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(item => {
        return current.id === item.id;
      });
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    ...mapActions(["deleteSong", "deleteList"])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      this.scrollToCurrent(newSong);
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'

.playlist {
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 200
  display: flex
  align-items: center
  width: 100%
  background: $color-background-d

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s

    .list-wrapper {
      transition: all 0.3s
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0

    .list-wrapper {
      transform: translate(0, 100%, 0)
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute
    bottom: 0
    left: 0
    width: 100%
    background-color: $color-highlight-background

    .list-header {
      position: relative
      padding: 20px 30px 10px 20px

      .title {
        display: flex
        align-items: center

        .icon {
          margin-right: 10px
          color: $color-theme-d
          font-size: 30px
        }

        .text {
          flex: 1
          color: $color-theme-l
          font-size: $font-size-medium
        }

        .clear {
          extend-click()

          .icon-clear {
            color: $color-text-d
            font-size: $font-size-medium
          }
        }
      }
    }

    .list-content {
      overflow: hidden
      max-height: 240px

      .item {
        display: flex
        align-items: center
        overflow: hidden
        padding: 0 30px 0 20px
        height: 40px

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s
        }

        &.list-enter, &.list-leave-to {
          height: 0
        }

        .current {
          flex: 0 0 20px
          width: 20px
          color: $color-theme-d
          font-size: $font-size-small
        }

        .text {
          flex: 1
          no-wrap()
          color: $color-text-d
          font-size: $font-size-medium
        }

        .like {
          extend-click()
          margin-right: 15px
          color: $color-theme
          font-size: $font-size-small

          .icon-favorite {
            color: $color-sub-theme
          }
        }

        .delete {
          extend-click()
          color: $color-theme
          font-size: $font-size-small
        }
      }
    }

    .list-operate {
      margin: 20px auto 30px
      width: 140px

      .add {
        display: flex
        align-items: center
        padding: 8px 16px
        border: 1px solid $color-text-l
        border-radius: 100px
        color: $color-text-l

        .icon-add {
          margin-right: 5px
          font-size: $font-size-small-s
        }

        .text {
          font-size: $font-size-small
        }
      }
    }

    .list-close {
      background: $color-background
      color: $color-text-l
      text-align: center
      font-size: $font-size-medium-x
      line-height: 50px
    }
  }
}
</style>