<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchbox ref="searchBox" @query="onQueryChange"></searchbox>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                class="item"
                v-for="(item, index) in hotKey"
                :key="index"
                @click="addQuery(item.k)"
              >
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-history :searches="searchHistory" @select="addQuery" @delete="deleteSearch"></search-history>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" ref="suggest" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" @confirm="deleteAll"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from "@/base/search-box/search-box";
import { getHotKey } from "@/api/search";
import { ERR_OK } from "@/api/config";
import Scroll from "@/base/scroll/scroll";
import Suggest from "@/components/suggest/suggest";
import { playlistMixin } from "@/common/js/mixin";
import { mapActions, mapGetters } from "vuex";
import SearchHistory from "@/base/search-history/search-history";
import Confirm from "@/base/confirm/confirm";
import { searchMixin } from "@/common/js/mixin";

export default {
  name: "Search",
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotKey: []
    };
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    }
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  },
  components: {
    searchbox: SearchBox,
    scroll: Scroll,
    suggest: Suggest,
    searchHistory: SearchHistory,
    confirm: Confirm
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();
      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    deleteAll() {
      this.clearSearchHistory();
    },
    deleteSearch(item) {
      this.deleteSearchHistory(item);
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    ...mapActions(["saveSearchHistory", "clearSearchHistory"])
  },
  created() {
    this._getHotKey();
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'

.search {
  .search-box-wrapper {
    margin: 20px
  }

  .shortcut-wrapper {
    position: fixed
    top: 178px
    bottom: 0
    width: 100%

    .shortcut {
      overflow: hidden
      height: 100%

      .hot-key {
        margin: 0 20px 20px

        .title {
          margin-bottom: 20px
          color: $color-text-l
          font-size: $font-size-medium
        }

        .item {
          display: inline-block
          margin: 0 20px 10px 0
          padding: 5px 10px
          border-radius: 6px
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-medium
        }
      }

      .search-history {
        position: relative
        margin: 0 20px

        .title {
          display: flex
          align-items: center
          color: $color-text-l
          font-size: $font-size-medium
          hight: 40px
        }

        .text {
          flex: 1
        }

        .clear {
          extend-click()

          .icon-clear {
            color: $color-text-d
            font-size: font-size-medium
          }
        }
      }
    }
  }

  .search-result {
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
  }
}
</style>
