<template>
  <scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
            @click="selectItem(item)"
            v-for="(item, index) in group.items"
            :key="index"
            class="list-group-item"
          >
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          v-for="(item, index) in shorcutList"
          :key="index"
          :data-index="index"
          :class="{'current': currentIndex===index}"
          class="item"
        >{{ item }}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";
import { getData } from "@/common/js/dom";
const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;
export default {
  name: "ListView",
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    shorcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return;
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },

    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      // 需要将字符串转化为数字 否则字符串和数字相加会变成字符串
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    refresh() {
      this.$refs.listview.refresh();
    },
    scroll(pos) {
      // 配合scroll实时获得y值
      this.scrollY = pos.y;
    },
    _scrollTo(index) {
      // 第二个参数的含义为动画过渡时间
      if (!index && index != 0) {
        return;
      }
      // 解决index < 0 或者 >22
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
        console.log(index);
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      // 监听到y值得变化
      const listHeight = this.listHeight;
      // 滚动到顶部newY > 0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动 遍历到列表长度-1
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          // height2是下一块的高度 newY是当前滚动的高度（负值）
          this.diff = height2 + newY;
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限, 元素的index为length-2
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      // 如果newVal不在0-30 fixTop没有变化 跳出计算
      if (this.fixedTop == fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      console.log(this.fixedTop);
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable'

.listview {
  position: relative
  overflow: hidden
  width: 100%
  height: 100%
  background: $color-background

  .list-group {
    padding-bottom: 30px

    .list-group-title {
      padding-left: 20px
      height: 30px
      background: $color-highlight-background
      color: $color-text-l
      font-size: $font-size-small
      line-height: 30px
    }

    .list-group-item {
      display: flex
      align-items: center
      padding: 20px 0 0 30px

      .avatar {
        width: 50px
        height: 50px
        border-radius: 50%
      }

      .name {
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
      }
    }
  }

  .list-shortcut {
    position: absolute
    top: 50%
    right: 0
    z-index: 30
    padding: 20px 0
    width: 20px
    border-radius: 10px
    background: $color-background-d
    text-align: center
    font-family: Helvetica
    transform: translateY(-50%)

    .item {
      padding: 3px
      color: $color-text-l
      font-size: $font-size-small
      line-height: 1

      &.current {
        color: $color-theme
      }
    }
  }

  .list-fixed {
    position: absolute
    top: 0
    left: 0
    width: 100%

    .fixed-title {
      padding-left: 20px
      height: 30px
      background: $color-highlight-background
      color: $color-text-l
      font-size: $font-size-small
      line-height: 30px
    }
  }

  .loading-container {
    position: absolute
    top: 50%
    width: 100%
    transform: translateY(-50%)
  }
}
</style>