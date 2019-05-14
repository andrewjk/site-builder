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
        <template v-if="block.content">
          <div v-html="block.content"></div>
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
  import { mapGetters, mapMutations } from 'vuex'
  import { create } from 'vue-modal-dialogs'

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
        expandSettings: false
      }
    },
    computed: {
      ...mapGetters([
        'blocks'
      ])
    },
    mounted () {
      // Build all blocks that haven't yet been built
      // TODO: Probably in the store?
      this.page.blocks.filter((block) => !block.content).map((block) => {
        let content = this.blocks.find((template) => template.name === block.name).content

        // TODO: Make this dynamic, per https://stackoverflow.com/questions/39516731/dynamic-html-elements-in-vue-js
        const regex = /{{ (.+) }}/gi
        content = content.replace(regex, `<div class="data-input">$1</div>`)

        block.content = content
      })
    },
    methods: {
      ...mapMutations([
        'SET_PAGE_VALUE',
        'INSERT_BLOCK'
      ]),
      onChange (key, value) {
        this.SET_PAGE_VALUE({ page: this.page, key, value })
      },
      async addBlock () {
        const prompt = create(SelectBlockDialog)
        const result = await prompt({ content: 'Select the type of block that you\'d like to add' }).transition()
        this.INSERT_BLOCK({ page: this.page, block: { name: result.name } })
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
