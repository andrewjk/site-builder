<template>
  <div class="collection-editor-wrapper">
    <div class="title">TODO: Collection</div>
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
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  label {
    margin-right: 20px;
  }
</style>
