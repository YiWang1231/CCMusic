<template>
  <div class="singer" ref="singer">
    <listview @select="selectSinger" :data="singers" ref="list"></listview>
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getSingerList } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import Singer from "@/common/js/singer";
import ListView from "@/base/listview/listview";
import { mapMutations } from "vuex";
import { playlistMixin } from "@/common/js/mixin";

const HOT_NAME = "热门";
const HOT_SINGER_LENGTH = 10;

export default {
  name: "Singer",
  mixins: [playlistMixin],
  data() {
    return {
      singers: [],
      transitionName: ""
    };
  },
  components: {
    listview: ListView
  },
  created() {
    this._getSingerList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    selectSinger(singer) {
      this.transitionName = "slide";
      console.log(this.transitionName);
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      // 使用setSinger方法将singer传入state，以保证状态共享
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list);
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
        // 按名称索引
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });
      // 为了得到有序列表 需要处理map
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        // 升序排列
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return hot.concat(ret);
    },
    ...mapMutations({
      // 引用sore中SET_SINGER方法， function(singer){}state.singer = singer
      setSinger: "SET_SINGER"
    })
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable'

.singer {
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0)
}
</style>