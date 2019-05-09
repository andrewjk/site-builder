
<template>
  <div class="block-editor-wrapper">
    <div class="title">Block: {{ block.name }}</div>
    <data-editor :definition="definition" :data="data" @change="onChange"/>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import DataEditor from './DataEditor'

  export default {
    components: { DataEditor },
    props: {
      block: {},
      definition: {},
      data: {}
    },
    methods: {
      ...mapMutations([
        'SET_BLOCK_VALUE'
      ]),
      onChange (key, value) {
        this.SET_BLOCK_VALUE({ block: this.block, key, value })
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
