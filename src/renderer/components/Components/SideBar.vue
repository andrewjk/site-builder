<template>
  <div class="side-bar-wrapper">
    <div v-for="section in sections" :key="section.key">
      <div v-if="section.class === 'title'" class="side-bar-title">
        <button @click="setActiveSection(section)">
          {{ section.text }}
        </button>
      </div>
      <div v-else-if="section.class === 'item'" :class="['side-bar-section', section.isActive ? 'selected' : '']">
        <input v-if="section.renaming" type="text" v-model="newName" @keydown.enter="renameSomething(section)" @keydown.escape="toggleRenamingSomething(section)" ref="input">
        <button v-else @click="setActiveSection(section)" @keydown.delete="deleteSomething(section)" @keydown.f2="toggleRenamingSomething(section)">
          {{ section.text }}
        </button>
      </div>
      <div v-else-if="section.class === 'add'" class="side-bar-section add-button">
        <button @click="addSomething(section)">
          <fa icon="plus"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { create } from 'vue-modal-dialogs'

  import ConfirmDialog from '../Dialogs/ConfirmDialog'

  export default {
    data () {
      return {
        newName: ''
      }
    },
    computed: {
      ...mapState({
        sections: state => state.State.sections
      })
    },
    methods: {
      ...mapMutations([
        'TOGGLE_RENAMING_SECTION'
      ]),
      ...mapActions([
        'setHelpSection',
        'setActiveSection',
        'addPage',
        'addData',
        'deleteCollection',
        'deletePage',
        'renameCollection',
        'renamePage'
      ]),
      addSomething (section) {
        const key = section.key
        if (key === 'add-collection') {
          this.addData()
        } else if (key === 'add-page') {
          this.addPage()
        }
      },
      async deleteSomething (section) {
        const key = section.key
        if (key.indexOf('coll-') === 0) {
          const dialog = create(ConfirmDialog)
          const result = await dialog({ content: 'Are you sure you want to delete this data?', confirmText: 'Yes', cancelText: 'No' }).transition()
          if (result) {
            const collection = section.collection
            this.deleteCollection(collection)
          }
        } else if (key.indexOf('page-') === 0) {
          const dialog = create(ConfirmDialog)
          const result = await dialog({ content: 'Are you sure you want to delete this page?', confirmText: 'Yes', cancelText: 'No' }).transition()
          if (result) {
            const page = section.page
            this.deletePage(page)
          }
        }
      },
      async toggleRenamingSomething (section) {
        this.newName = section.text
        this.TOGGLE_RENAMING_SECTION(section)
        Vue.nextTick(() => {
          const el = this.$refs['input'][0]
          if (el) {
            el.focus()
            el.select()
          }
        })
      },
      async renameSomething (section) {
        const key = section.key
        if (key.indexOf('coll-') === 0) {
          const collection = section.collection
          this.renameCollection({ collection, name: this.newName })
        } else if (key.indexOf('page-') === 0) {
          const page = section.page
          this.renamePage({ page, name: this.newName })
        }
        this.TOGGLE_RENAMING_SECTION(section)
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
  .side-bar-section {
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

  .side-bar-section {
    button {
      padding: 4px 9px;
    }
  }

  .side-bar-title.selected,
  .side-bar-section.selected {
    button {
      color: orange;
    }
  }
</style>
