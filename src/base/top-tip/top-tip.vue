<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showFlag: false
    };
  },
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    show() {
      this.showFlag = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hide();
      }, this.delay);
    },
    hide() {
      this.showFlag = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'

.top-tip {
  position: fixed
  top: 0
  z-index: 500
  width: 100%
  background: $color-dialog-background

  &.drop-enter-active, &.drop-leave-to-active {
    transition: all 0.3s
  }

  &.drop-enter, &.drop-leave-to {
    transform: translate3d(0, -100%, 0)
  }
}
</style>