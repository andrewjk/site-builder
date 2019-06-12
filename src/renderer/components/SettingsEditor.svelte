<script>
  import DataEditor from "./DataEditor";

  export let name = "";
  export let definition = {};
  export let data = {};
</script>

<style scoped>
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }
</style>

<div class="page-editor-wrapper">
  <div class="title">{definition.title}</div>
  <DataEditor {definition} {data} />
</div>
