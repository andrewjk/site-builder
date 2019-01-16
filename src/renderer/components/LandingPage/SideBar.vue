<template>
  <div class="side-bar-wrapper">
    <div class="side-bar-title">Info</div>
    <div class="side-bar-item">Site</div>
    <div class="side-bar-item">Hours</div>
    <div class="side-bar-title">Data</div>
    <div class="side-bar-item">News</div>
    <div class="side-bar-item">Items</div>
    <div class="side-bar-title">Pages</div>
    <div class="side-bar-item">_Layout</div>
    <div class="side-bar-item">Main</div>
    <div class="side-bar-item">About</div>
    <div class="side-bar-item">Contact</div>
    <div class="side-bar-title">Blocks</div>
    <div class="side-bar-item">Header</div>
    <div class="side-bar-item">Footer</div>
    <div class="side-bar-item">Hours</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        electron: process.versions.electron,
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version
      }
    }
  }
</script>

<style scoped>

  .side-bar-wrapper {
    background-color: #2d2d2d;
    color: #eee;
    height: 100vh;
    max-width: 120px;
    overflow: hidden;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }

  .side-bar-title {
    text-transform: uppercase;
    margin: 5px 0;
    font-size: 80%;
  }

</style>
