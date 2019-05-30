<template>
  <div class="collection-editor-wrapper">
    <div class="title">Collection: {{ name }}</div>

    <div class="expander">
      <div class="expander-title" @click="expandDefinitions = !expandDefinitions">
        <span class="expander-icon"><fa :icon="expandDefinitions ? 'caret-down' : 'caret-right'"/></span>
        <span>Fields</span>
      </div>
      <div class="expander-body" v-show="expandDefinitions">
        <definitions-editor :definitions="data.definitions"/>
      </div>
    </div>

    <div class="expander">
      <div class="expander-title" @click="expandItems = !expandItems">
        <span class="expander-icon"><fa :icon="expandItems ? 'caret-down' : 'caret-right'"/></span>
        <span>Items</span>
      </div>
      <div class="expander-body" v-show="expandItems">
        <div v-for="(item, index) in data.items" :key="index">
          <div class="subtitle">Item {{ index + 1 }}</div>
          <data-editor :definition="data" :data="item" @change="(key, value) => onChange(key, value, index)"/>
        </div>
        <div class="edit-collection-buttons">
          <button title="Add an item" @click="addItem">
            <fa icon="plus"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import DefinitionsEditor from './DefinitionsEditor'
  import DataEditor from './DataEditor'

  export default {
    components: { DefinitionsEditor, DataEditor },
    props: {
      name: '',
      data: {}
    },
    data () {
      return {
        expandDefinitions: false,
        expandItems: false
      }
    },
    methods: {
      ...mapMutations([
        'ADD_COLLECTION_ITEM',
        'SET_COLLECTION_ITEM_VALUE'
      ]),
      addItem () {
        this.ADD_COLLECTION_ITEM({ collection: this.data.items, definitions: this.data.definitions })
      },
      onChange (key, value, index) {
        this.SET_COLLECTION_ITEM_VALUE({ item: this.data.items[index], key, value })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 16px;
    margin: 8px 0;
  }

  label {
    margin-right: 20px;
  }

  .expander-title {
    cursor: pointer;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .expander-icon {
    font-size: 14px;
    svg {
      vertical-align: baseline;
    }
  }

  .expander-body {
    margin-bottom: 20px;
  }

  .edit-collection-buttons {
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
</style>
