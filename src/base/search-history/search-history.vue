<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="item in searches" :key="item" @click="selectItem(item)">
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    deleteOne(item) {
      this.$emit("delete", item);
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~@/common/stylus/variable'

.search-list {
  padding-top: 10px

  &.list-enter-active, &.list-leave-active {
    transition: all 0.1s
  }

  &.list-enter, &.list-leave-to {
    height: 0
  }

  .search-item {
    display: flex
    align-items: center
    overflow: hidden
    height: 40px

    .text {
      flex: 1
      color: $color-text-l
    }

    .icon {
      extend-click()

      .icon-delete {
        color: $color-text-d
        font-size: $font-size-small
      }
    }
  }
}
</style>