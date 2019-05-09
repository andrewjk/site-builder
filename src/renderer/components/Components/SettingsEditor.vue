<template>
  <div class="page-editor-wrapper">
    <div class="title">{{ definition.title }}</div>
    <data-editor :definition="definition" :data="data" @change="onChange"/>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import DataEditor from './DataEditor'

  export default {
    components: { DataEditor },
    props: {
      name: '',
      definition: {},
      data: {}
    },
    methods: {
      ...mapMutations([
        'SET_SETTINGS_VALUE'
      ]),
      onChange (key, value) {
        this.SET_SETTINGS_VALUE({ name: this.name, key, value })
      }
    }
  }
</script>

<style scoped>
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }
</style>
