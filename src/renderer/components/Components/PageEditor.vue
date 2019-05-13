<template>
  <div class="page-editor-wrapper">
    <div class="title">Page: {{ page.name }}</div>
    <data-editor :definition="definition" :data="data" @change="onChange"/>
    <div class="page-block-wrapper">
      <div class="edit-block-buttons">
        <button title="Add a block" @click="addBlock">
          <fa icon="plus"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
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
        console.log(result)
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

  .page-block-wrapper {
    border: 1px solid rgba(0, 0, 0, .2);
    border-radius: 2px;
    min-height: 400px;
  }

  .edit-block-buttons {
    button {
      border: 1px solid transparent;
      border-radius: 2px;
      color: inherit;
      margin: 2px;
      padding: 10px;
      width: 100%;
    }
    button:hover {
      background-color: rgba(0, 0, 0, 0.15);
    }
    button:focus {
      border: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
</style>
