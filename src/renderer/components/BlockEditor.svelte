<script>
  import DataEditor from "./DataEditor";

  export let block = null;
  export let definition = null;
  export let data = null;

  function handleChange() {}
</script>

<style>
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }
</style>

<div class="block-editor-wrapper">
  <div class="title">Block: {block.name}</div>
  <DataEditor {definition} {data} on:change={handleChange} />
</div>
