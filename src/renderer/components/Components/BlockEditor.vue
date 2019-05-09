
<template>
  <div class="block-editor-wrapper">
    <div class="title">Block: {{ block.name }}</div>
    <data-editor :definition="definition" :data="data"></data-editor>
  </div>
</template>

<script>
  import DataEditor from './DataEditor'

  export default {
    components: { DataEditor },
    props: {
      block: {},
      definition: {},
      data: {}
    }
  }
</script>

<style scoped>
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  label {
    margin-right: 20px;
  }
</style>
