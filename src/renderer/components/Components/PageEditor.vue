<template>
  <div class="page-editor-wrapper">
    <div class="title">Page: {{ page.name }}</div>

    <div class="expander">
      <div class="expander-title" @click="expandSettings = !expandSettings">
        <span class="expander-icon"><fa :icon="expandSettings ? 'caret-down' : 'caret-right'"/></span>
        <span>Settings</span>
      </div>
      <div v-show="expandSettings">
        <data-editor :definition="definition" :data="data" @change="onChange"/>
      </div>
    </div>

    <div class="page-block-wrapper">
      <webview class="page-block-editor" :src="page.tempFile" :preload="preload" autosize minwidth="0" minheight="0" ref="webview"/>
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

  import electron from 'electron'
  import path from 'path'

  import DataEditor from './DataEditor'
  import SelectBlockDialog from '../Dialogs/SelectBlockDialog'

  export default {
    components: { DataEditor },
    props: {
      page: {},
      definition: {},
      data: {}
    },
    data () {
      return {
        expandSettings: false,
        // Per https://github.com/SimulatedGREG/electron-vue/issues/239
        preload: 'file://' + path.join(__static, '/page-editor.js')
      }
    },
    computed: {
      ...mapGetters([
        'blocks'
      ])
    },
    async mounted () {
      await this.buildPageEditorHtml({ page: this.page, blocks: this.blocks })
      this.setupWebviewListeners()
    },
    beforeUpdate () {
      if (!this.page.tempFile) {
        this.buildPageEditorHtml({ page: this.page, blocks: this.blocks })
      }
    },
    methods: {
      ...mapMutations([
        'SET_PAGE_VALUE',
        'INSERT_BLOCK',
        'SET_BLOCK_DATA'
      ]),
      ...mapActions([
        'buildPageEditorHtml'
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
      async addBlock () {
        const prompt = create(SelectBlockDialog)
        const templateBlock = await prompt({ content: 'Select the type of block that you\'d like to add' }).transition()
        const block = { name: templateBlock.name, data: {} }
        this.INSERT_BLOCK({ page: this.page, block })
        await this.buildPageEditorHtml({ page: this.page, blocks: this.blocks })
        this.$refs.webview.reload()
      },
      setupWebviewListeners () {
        const webview = this.$refs.webview

        // Listen to console messages from within the webview (handy for debugging the webview-preload script)
        // But only listen to messages that start with a $ because those will be the ones that we have made
        webview.addEventListener('console-message', (e) => {
          if (e.message.indexOf('$') === 0) {
            console.log('WEBVIEW:', e.message.substring(1))
          }
        })

        // Listen to changes to inputs and update the corresponding block data
        electron.remote.ipcMain.on('block-input-changed', async (event, { pageId, blockId, data }) => {
          if (pageId === this.page.id) {
            const block = this.page.blocks.find((block) => block.id === blockId)
            console.log(block, blockId)
            const newData = Object.assign({}, block.data, data)
            this.SET_BLOCK_DATA({ block, data: newData })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .page-editor-wrapper {
    display: grid;
    grid-template-rows: auto auto 1fr;
  }

  .expander-title {
    cursor: pointer;
    font-size: 20px;
    margin-bottom: 10px;
  }

  .expander-icon {
    font-size: 14px;

    svg {
      vertical-align: baseline;
    }
  }

  .page-block-wrapper {
    border: 1px solid rgba(0, 0, 0, .2);
    border-radius: 2px;
    min-height: 400px;
    display: grid;
    grid-template-rows: 1fr auto;
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
