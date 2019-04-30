<template>
  <div class="side-bar-wrapper">
    <div v-for="(item, index) in sections" :key="item.key">
      <div v-if="item.class === 'title'" class="side-bar-title">
        {{ item.text }}
      </div>
      <div v-else-if="item.class === 'item'" :class="['side-bar-item', item.isActive ? 'selected' : '']">
        <button @click="setActiveSection(index)">
          {{ item.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState({
        sections: state => state.State.sections
      })
    },
    methods: {
      ...mapActions([
        'setActiveSection'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .side-bar-wrapper {
    background-color: #2d2d2d;
    color: #eee;
    height: 100vh;
    width: 120px;
    overflow: hidden;
    padding: 0 10px;
  }

  .side-bar-title {
    font-size: 13px;
    padding: 15px 0;
    text-transform: uppercase;
  }

  .side-bar-item {
    button {
      border-radius: 2px;
      color: inherit;
      padding: 5px;
      text-align: left;
      width: 100%;
    }

    button:hover,
    button:focus {
      background-color: rgba(255, 255, 255, 0.15)
    }
  }

  .side-bar-item.selected {
    button {
      color: orange;
    }
  }
</style>
