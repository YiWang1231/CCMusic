<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{ text }}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">{{ cancelBtnText }}</div>
            <div class="operate-btn" @click="confirm">{{ confirmBtnTetx }}</div>
          </div>
        </div>
      </div>
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
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    confirm() {
      this.hide();
      this.$emit("confirm");
    },
    cancel() {
      this.hide();
    }
  },
  props: {
    text: {
      type: String,
      default: ""
    },
    confirmBtnTetx: {
      type: String,
      default: "确定"
    },
    cancelBtnText: {
      type: String,
      default: "取消"
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable'

.confirm {
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 998
  background-color: $color-background-d

  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s

    .confirm-content {
      animation: confirm-zoom 0.3s
    }
  }

  .confirm-wrapper {
    position: absolute
    top: 50%
    left: 50%
    z-index: 999
    transform: translate(-50%, -50%)

    .confirm-content {
      width: 270px
      border-radius: 13px
      background: $color-highlight-background

      .text {
        padding: 19px 15px
        color: $color-text-l
        text-align: center
        font-size: $font-size-large
        line-height: 22px
      }

      .operate {
        display: flex
        align-items: center
        text-align: center
        font-size: $font-size-large

        .operate-btn {
          flex: 1
          padding: 10px 0
          border-top: 1px solid $color-background-d
          color: $color-text-d

          &.left {
            border-right: 1px solid $color-background-d
          }
        }
      }
    }
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0
  }

  100% {
    opacity: 100%
  }
}

@keyframes confirm-zoom {
  0% {
    transform: scale(0)
  }

  50% {
    transform: scale(1.1)
  }

  100% {
    transform: scale(1)
  }
}
</style>