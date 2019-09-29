<template>
  <musiclist :title="title" :bg-image="bgImage" :songs="songs"></musiclist>
</template>
<script>
import MusicList from "@/components/music-list/music-list";
import { getSongList } from "@/api/recommend";
import { getSongVkey } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import { mapGetters } from "vuex";
import { createDiscSong } from "@/common/js/song";

export default {
  name: "Disc",
  components: {
    musiclist: MusicList
  },
  data() {
    return {
      songs: []
    };
  },
  methods: {
    _getSongList() {
      if (!this.dissid) {
        this.$router.push("/recommend");
      }
      getSongList(this.dissid).then(res => {
        if (res.code === ERR_OK) {
          console.log(this._normalizeSongs(res.cdlist[0].songlist));
          this.songs = this._normalizeSongs(res.cdlist[0].songlist);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.mid && musicData.album) {
          ret.push(createDiscSong(musicData));
          // getSongVkey(musicData.mid).then(res => {
          //   if (res.code === ERR_OK) {
          //     const url = res.req_0.data.midurlinfo[0].purl;
          //     ret.push(createDiscSong(musicData, url));
          //   }
          // });
        }
      });
      return ret;
    }
  },
  created() {
    console.log(this.dissid);
    this._getSongList();
  },
  computed: {
    ...mapGetters(["disc"]),
    dissid() {
      return this.disc.dissid;
    },
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    }
  }
};
</script>
<style scoped lang="stylus"></style>