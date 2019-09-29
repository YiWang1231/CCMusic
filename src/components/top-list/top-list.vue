<template>
  <musiclist :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></musiclist>
</template>

<script>
import MusicList from "@/components/music-list/music-list";
import { mapGetters } from "vuex";
import { getMusicList } from "@/api/rank";
import { ERR_OK } from "@/api/config";
import { getSongVkey } from "@/api/singer";
import { createSong } from "@/common/js/song";

export default {
  name: "TopList",
  data() {
    return { songs: [], rank: true };
  },
  components: {
    musiclist: MusicList
  },
  computed: {
    ...mapGetters(["topList"]),
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
    }
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push("/rank");
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        const musicData = item.data;
        if (musicData.songmid && musicData.albummid) {
          getSongVkey(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              const url = res.req_0.data.midurlinfo[0].purl;
              ret.push(createSong(musicData, url));
            }
          });
        }
      });
      return ret;
    }
  },
  created() {
    this._getMusicList();
  }
};
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'
</style>