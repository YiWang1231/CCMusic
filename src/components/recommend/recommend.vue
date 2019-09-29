<template>
  <div class="recommend" ref="recommends">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!-- 轮播图 -->
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img @load="loadImg" :src="item.picUrl" />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              v-for="(disc, index) in discList"
              :key="index"
              class="item"
              @click="selectDisc(disc)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="disc.imgurl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="disc.creator.name"></h2>
                <p class="desc" v-html="disc.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from "@/api/recommend";
import { ERR_OK } from "@/api/config";
import Slider from "@/base/slider/slider";
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";
import { playlistMixin } from "@/common/js/mixin";
import { mapMutations } from "vuex";

export default {
  name: "Recommend",
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    // setTimeout(() => {}, 1000);
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.recommends.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    selectDisc(disc) {
      this.$router.push({
        path: `/recommend/${disc.dissid}`
      });
      //
      this.setDisc(disc);
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        } else {
          console.log("没,没有轮播");
        }
      });
    },
    _getDiscList() {
      getDiscList()
        .then(res => {
          // console.log(res);
          if (res.code === ERR_OK) {
            this.discList = res.data.list;
          }
        })
        .catch(() => {
          console.log("找不到数据");
        });
    },
    // 新版不需要处理该问题
    loadImg() {
      // 防止图片异步加载后容器高度发生变化 scroll组件获取不了新的高度无法滑动到底部
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        // 设置标志位，确保逻辑执行一次
        this.checkLoaded = true;
      }
    },
    ...mapMutations({
      setDisc: "SET_DISC"
    })
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable'

.recommend {
  position: fixed
  top: 88px
  bottom: 0
  width: 100%

  .recommend-content {
    overflow: hidden
    height: 100%

    .slider-wrapper {
      position: relative
      overflow: hidden
      width: 100%
    }

    .recommend-list {
      .list-title {
        height: 65px
        color: $color-theme
        text-align: center
        font-size: $font-size-medium
        line-height: 65px
      }

      .item {
        display: flex
        // 水平居中
        align-items: center
        box-sizing: border-box
        padding: 0 20px 20px

        // 图片固定在左侧
        .icon {
          flex: 0 0 60px
          padding-right: 20px
          width: 60px
        }

        .text {
          display: flex
          flex: 1
          flex-direction: column
          justify-content: center
          overflow: hidden
          font-size: $font-size-medium
          line-height: 20px

          .name {
            margin-bottom: 10px
            color: $color-text
          }

          .desc {
            color: $color-text-d
          }
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