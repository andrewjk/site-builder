<template>
  <div class="page-editor-wrapper">
    <div class="title">TODO: Page</div>
    <data-editor :definition="definition" :data="data"></data-editor>
  </div>
</template>

<script>
  import DataEditor from './DataEditor'

  export default {
    components: { DataEditor },
    props: {
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
</style>
