
<template>
  <div class="collection-editor-wrapper">
    <div class="title">TODO: Block</div>
  </div>
</template>

<script>
  export default {
    props: {
      definition: {},
      collection: {}
    }
  }
</script>

<style scoped>
  .collection-editor-wrapper {
    padding: 20px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  label {
    margin-right: 20px;
  }
</style>
