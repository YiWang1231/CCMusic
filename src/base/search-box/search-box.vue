<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" v-model="query" ref="query" />
    <i @click="clear" class="icon-dismiss" v-show="query"></i>
  </div>
</template>

<script>
import { debounce } from "@/common/js/util";
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    blur() {
      this.$refs.query.blur();
    },
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    }
  },
  created() {
    this.$watch(
      "query",
      debounce(newQuery => {
        this.$emit("query", newQuery);
      }, 200)
    );
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'

.search-box {
  display: flex
  align-items: center
  box-sizing: border-box
  padding: 0 6px
  width: 100%
  height: 40px
  border-radius: 6px
  background: $color-highlight-background

  .icon-search {
    color: $color-background
    font-size: 24px
  }

  .box {
    flex: 1
    margin: 0 5px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium
    line-height: 18px

    &::placeholder {
      color: $color-text-d
    }
  }

  .icon-dismiss {
    color: $color-background
    font-size: 16px
  }
}
</style>