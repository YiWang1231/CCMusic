<template>
  <musiclist :title="title" :bg-image="singer.avatar" :songs="songs"></musiclist>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import { getSingerDetail, getSongVkey } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import { createSong } from "@/common/js/song";
import MusicList from "@/components/music-list/music-list";

export default {
  name: "SingerDetail",
  components: {
    musiclist: MusicList
  },
  created() {
    this._getDetail();
  },
  data() {
    return {
      songs: []
    };
  },
  methods: {
    back() {
      this.$router.push("/singer");
    },
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normallizeSongs(res.data.list);
        }
      });
    },
    _normallizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      // console.log(ret);
      return ret;
    }
  },
  computed: {
    // 获得state中状态
    ...mapGetters(["singer"]),
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>