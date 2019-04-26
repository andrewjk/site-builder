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
  }
</script>

<style scoped>
  .side-bar-wrapper {
    background-color: #2d2d2d;
    color: #eee;
    height: 100vh;
    width: 120px;
    overflow: hidden;
    padding: 0 10px;
  }

  .side-bar-title {
    font-size: 80%;
    margin: 15px 0;
    text-transform: uppercase;
  }

  .side-bar-item {
    margin: 10px 0; 
  }
</style>
