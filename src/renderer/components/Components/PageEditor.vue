<template>
  <div class="page-editor-wrapper">
    <div class="title">Page: {{ page.name }}</div>

    <div class="expander-title" @click="expandSettings = !expandSettings">
      <span class="expander-icon"><fa :icon="expandSettings ? 'minus' : 'plus'"/></span>
      <span>Settings</span>
    </div>
    <div v-show="expandSettings">
      <data-editor :definition="definition" :data="data" @change="onChange"/>
    </div>

    <div class="page-block-wrapper">
      <div v-for="block in page.blocks" :key="block.name" class="page-block">
        <template v-if="block.tempFile">
          <page-block-editor :block="block"/>
        </template>
        <template v-else>
          Loading...
        </template>
      </div>
      <div class="edit-block-buttons">
        <button title="Add a block" @click="addBlock">
          <fa icon="plus"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { create } from 'vue-modal-dialogs'
  import path from 'path'

  import DataEditor from './DataEditor'
  import PageBlockEditor from './PageBlockEditor'
  import SelectBlockDialog from '../Dialogs/SelectBlockDialog'

  export default {
    components: { DataEditor, PageBlockEditor },
    props: {
      page: {},
      definition: {},
      data: {}
    },
    data () {
      return {
        expandSettings: false,
        // Per https://github.com/SimulatedGREG/electron-vue/issues/239
        preload: 'file://' + path.join(__static, '/block-editor.js')
      }
    },
    computed: {
      ...mapGetters([
        'blocks'
      ])
    },
    mounted () {
      this.buildBlocks()
    },
    beforeUpdate () {
      this.buildBlocks()
    },
    methods: {
      ...mapMutations([
        'SET_PAGE_VALUE',
        'INSERT_BLOCK'
      ]),
      ...mapActions([
        'buildBlockContent'
      ]),
      onChange (key, value) {
        this.SET_PAGE_VALUE({ page: this.page, key, value })
      },
      dynamicBlock (block) {
        return {
          template: block.content,
          data () {
            return {
              data: block.data
            }
          },
          methods: {
            logData () {
              console.log(this.data)
            }
          }
        }
      },
      buildBlocks () {
        // Build all blocks that haven't yet been built
        // TODO: Probably in the store? Maybe just when loading the site initially??
        this.page.blocks.filter((block) => !block.tempFile).forEach((block) => {
          const templateBlock = this.blocks.find((b) => b.name === block.name)

          // NOTE: Originally tried to do a dynamic component (see dynamicBlock below), but I
          // couldn't get styles working
          // (see https://stackoverflow.com/questions/39516731/dynamic-html-elements-in-vue-js)
          // Instead we build the content into a temp html file, display it in a webview, and
          // TODO: use IPC messages to update data
          this.buildBlockContent({ page: this.page, block, templateBlock })
        })
      },
      async addBlock () {
        const prompt = create(SelectBlockDialog)
        const templateBlock = await prompt({ content: 'Select the type of block that you\'d like to add' }).transition()
        const block = { name: templateBlock.name, data: {}, tempFile: null }
        this.INSERT_BLOCK({ page: this.page, block })
        this.buildBlockContent({ page: this.page, block, templateBlock })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .expander-title {
    cursor: pointer;
    font-size: 20px;
    margin-bottom: 10px;
  }

  .expander-icon {
    font-size: 14px;
    vertical-align: top;
  }

  .page-block-wrapper {
    border: 1px solid rgba(0, 0, 0, .2);
    border-radius: 2px;
    min-height: 400px;
  }

  .edit-block-buttons {
    button {
      background-color: #ddd;
      border: 1px solid transparent;
      border-radius: 2px;
      color: inherit;
      padding: 10px;
      width: 100%;
    }
    button:hover {
      background-color: darken(#ddd, 9%);
    }
    button:focus {
      border: 1px solid rgba(0, 0, 0, 0.15);
    }
  }

  .data-input {
    background-color: red;
  }
</style>
