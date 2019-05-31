<template>
  <div class="definiot-editor-wrapper">
    <table>
      <thead>
        <tr>
          <td>Key</td>
          <td>Name</td>
          <td>Type</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(def, index) in definitions" :key="index">
          <td>
            <input type="text" :value="def.key" @input="setDefinitionValue(def, 'key', $event.target.value)">
          </td>
          <td>
            <input type="text" :value="def.name" @input="setDefinitionValue(def, 'name', $event.target.value)">
          </td>
          <td>
            <input type="text" :value="def.type" @input="setDefinitionValue(def, 'type', $event.target.value)">
          </td>
        </tr>
      </tbody>
    </table>
    <div class="edit-definition-buttons">
      <button title="Add a definition" @click="addDefinition">
        <fa icon="plus"/>
      </button>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    props: {
      definitions: Array,
      collection: Array
    },
    methods: {
      ...mapMutations([
        'ADD_DEFINITION',
        'SET_DEFINITION_FIELDS'
      ]),
      addDefinition () {
        this.ADD_DEFINITION(this.definitions)
      },
      setDefinitionValue (definition, field, value) {
        const fields = {}
        fields[field] = value
        this.SET_DEFINITION_FIELDS({ definition, fields, collection: this.collection })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  label {
    margin-right: 20px;
  }

  .edit-definition-buttons {
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
