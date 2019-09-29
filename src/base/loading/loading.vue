<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24" />
    <p class="desc">{{ title }}</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "Loading",
  props: {
    title: {
      type: String,
      default: "正在载入中..."
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~@/common/stylus/variable'

.loading {
  width: 100%
  text-align: center

  .desc {
    color: $color-text-l
    font-size: $font-size-small
    line-height: 20px
  }
}
</style>