<template>
  <div class="no-result">
    <p class="no-result-icon"></p>
    <p class="no-result-text">{{ title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'

.no-result {
  text-align: center

  .no-result-icon {
    margin: 0 auto
    width: 86px
    height: 90px
    bg-image('no-result')
    background-size: 86px 90px
  }

  .no-result-text {
    margin-top: 30px
    color: $color-text-d
    font-size: $font-size-medium
  }
}
</style>