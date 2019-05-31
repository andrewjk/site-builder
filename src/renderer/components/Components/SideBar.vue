<template>
  <div class="side-bar-wrapper">
    <div v-for="(item, index) in sections" :key="item.key">
      <div v-if="item.class === 'title'" class="side-bar-title">
        <button @click="setActiveSection(item)">
          {{ item.text }}
        </button>
      </div>
      <div v-else-if="item.class === 'item'" :class="['side-bar-item', item.isActive ? 'selected' : '']">
        <button @click="setActiveSection(item)" @keydown.delete="deleteSomething(index)" @keydown.f2="renameSomething(index)">
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
  import { create } from 'vue-modal-dialogs'

  import ConfirmDialog from '../Dialogs/ConfirmDialog'

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
        'addData',
        'deleteCollection',
        'deletePage'
      ]),
      addSomething (index) {
        const key = this.sections[index].key
        if (key === 'add-collection') {
          this.addData()
        } else if (key === 'add-page') {
          this.addPage()
        }
      },
      async deleteSomething (index) {
        const key = this.sections[index].key
        if (key.indexOf('coll-') === 0) {
          const dialog = create(ConfirmDialog)
          const result = await dialog({ content: 'Are you sure you want to delete this data?', confirmText: 'Yes', cancelText: 'No' }).transition()
          if (result) {
            const collection = this.sections[index].collection
            this.deleteCollection(collection)
          }
        } else if (key.indexOf('page-') === 0) {
          const dialog = create(ConfirmDialog)
          const result = await dialog({ content: 'Are you sure you want to delete this page?', confirmText: 'Yes', cancelText: 'No' }).transition()
          if (result) {
            const page = this.sections[index].page
            this.deletePage(page)
          }
        }
      },
      async renameSomething (index) {
        alert('todo: rename this')
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
