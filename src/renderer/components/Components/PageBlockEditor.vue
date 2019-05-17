<template>
  <webview :src="block.tempFile" :preload="preload" autosize minwidth="0" minheight="0" ref="webview"/>
</template>

<script>
  import { mapMutations } from 'vuex'

  import path from 'path'
  import electron from 'electron'

  export default {
    props: {
      block: {}
    },
    data () {
      return {
        // Per https://github.com/SimulatedGREG/electron-vue/issues/239
        preload: 'file://' + path.join(__static, '/block-editor.js')
      }
    },
    mounted () {
      this.setupWebviewListeners()
    },
    methods: {
      ...mapMutations([
        'SET_BLOCK_DATA'
      ]),
      setupWebviewListeners () {
        const webview = this.$refs.webview

        // Listen to console messages from within the webview (handy for debugging the webview-preload script)
        // But only listen to messages that start with a $ because those will be the ones that we have made
        webview.addEventListener('console-message', (e) => {
          if (e.message.indexOf('$') === 0) {
            console.log('WEBVIEW:', e.message.substring(1))
          }
        })

        // Set up login management for forms with password fields
        const blockId = this.block.id
        electron.remote.ipcMain.on('block-input-changed-' + blockId, async (event, data) => {
          const newData = Object.assign({}, this.block.data, data)
          this.SET_BLOCK_DATA({ block: this.block, data: newData })
        })
      }
    }
  }
</script>
