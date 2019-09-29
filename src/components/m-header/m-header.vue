<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Cc Music</h1>
  </div>
</template>

<script type="text/ecmascript-6">
export default {};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable'
@import '~@/common/stylus/mixin'

.m-header {
  position: relative
  height: 44px
  color: $color-text-l
  text-align: center
  font-size: 0

  .icon {
    display: inline-block
    margin-top: 6px
    margin-right: 9px
    width: 30px
    height: 32px
    vertical-align: top
    bg-image('111logo')
    background-size: 30px 32px
  }

  .text {
    display: inline-block
    color: $color-theme
    vertical-align: top
    font-size: $font-size-large
    line-height: 44px
  }

  .mine {
    position: absolute
    top: 0
    right: 0

    .icon-mine {
      display: block
      padding: 12px
      color: $color-theme
      font-size: 20px
    }
  }
}
</style>