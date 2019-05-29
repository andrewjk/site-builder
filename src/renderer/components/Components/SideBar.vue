<template>
  <div class="side-bar-wrapper">
    <div v-for="(item, index) in sections" :key="item.key">
      <div v-if="item.class === 'title'" class="side-bar-title">
        <button @click="setActiveSection(item)">
          {{ item.text }}
        </button>
      </div>
      <div v-else-if="item.class === 'item'" :class="['side-bar-item', item.isActive ? 'selected' : '']">
        <button @click="setActiveSection(item)">
          {{ item.text }}
        </button>
      </div>
      <div v-else-if="item.class === 'add'" class="side-bar-item add-button">
        <button @click="addSomething(index)">
          <fa icon="plus"/>
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
        'setHelpSection',
        'setActiveSection',
        'addPage',
        'addData'
      ]),
      addSomething (index) {
        const key = this.sections[index].key
        if (key === 'add-data') {
          this.addData()
        } else if (key === 'add-page') {
          this.addPage()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .side-bar-wrapper {
    background-color: #2d2d2d;
    color: #eee;
    height: 100%;
    width: 120px;
    overflow: hidden;
    padding: 0 10px;
  }

  .side-bar-title,
  .side-bar-item {
    button {
      border: 1px solid transparent;
      border-radius: 2px;
      color: inherit;
      text-align: left;
      width: 100%;
    }
    button:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
    button:focus {
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
  }

  .side-bar-title {
    button {
      color: #bbb;
      font-size: 13px;
      margin: 5px 0;
      padding: 6px 4px;
      text-transform: uppercase;
    }
  }

  .side-bar-item {
    button {
      padding: 4px 9px;
    }
  }

  .side-bar-title.selected,
  .side-bar-item.selected {
    button {
      color: orange;
    }
  }
</style>
