<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    :beforeScroll="beforeScroll"
    @beforeScroll="listScroll"
    ref="scroll"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
        @click="selectItem(item, index)"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{ getDisplayName(item) }}</p>
        </div>
      </li>
      <loading v-show="hasMore" title class="loading-container"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <noresult title="抱歉 暂无搜索结果"></noresult>
    </div>
  </scroll>
</template>
<script>
import { search } from "@/api/search";
import { ERR_OK } from "@/api/config";
import Scroll from "@/base/scroll/scroll";
import { createSong } from "@/common/js/song";
import { getSongVkey } from "@/api/singer";
import Singer from "@/common/js/singer";
import Loading from "@/base/loading/loading";
import { mapMutations, mapActions } from "vuex";
import NoResult from "@/base/no-result/no-result";

const TYPE_SINGER = "singer";
const perpage = 25;

export default {
  components: {
    scroll: Scroll,
    loading: Loading,
    noresult: NoResult
  },
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true
    };
  },
  methods: {
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["selectPlay", "insertSong"]),
    selectItem(item, index) {
      if (item.type === TYPE_SINGER) {
        this.$router.push({
          path: `/search/${item.id}`
        });
        this.setSinger(item);
      } else {
        this.insertSong(item);
      }
      this.$emit("select");
    },
    refresh() {
      this.$refs.scroll.refresh();
    },
    listScroll() {
      this.$emit("listScroll");
    },
    search() {
      this.page = 1;
      this.$refs.scroll.scrollTo(0, 0);
      this.hasMore = true;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data);
          this._checkMore(res.data);
        }
      });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data));
          this._checkMore(res.data);
        }
      });
    },
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage > song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.zhida_singer && data.song.curpage === 1) {
        // 拓展运算符
        let singer = new Singer({
          name: data.zhida.zhida_singer.singerName,
          id: data.zhida.zhida_singer.singerMID
        });
        ret.push({ ...singer, ...{ type: TYPE_SINGER } });
      }

      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs(list) {
      let ret = [];
      console.log(list.length);
      list.forEach(musicData => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.name;
      } else {
        return `${item.name}-${item.singer}`;
      }
    }
  },
  watch: {
    query(newQuery) {
      this.search();
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'

.suggest {
  overflow: hidden
  height: 100%

  .suggest-list {
    padding: 0 30px

    .suggest-item {
      display: flex
      align-items: center
      padding-bottom: 20px
    }

    .icon {
      flex: 0 0 30px
      width: 30px

      [class^='icon-'] {
        color: $color-text-d
        font-size: 14px
      }
    }

    .name {
      flex: 1
      overflow: hidden
      color: $color-text-d
      font-size: $font-size-medium

      .text {
        no-wrap()
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