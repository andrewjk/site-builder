<script>
  import { beforeUpdate } from "svelte";

  export let definition = null;
  export let data = null;

  beforeUpdate(() => {
    // Update data from the definition, just in case it hasn't been loaded or the template has changed
    definition.fields.forEach(def => {
      if (!data[def.key]) {
        // TODO: Depends on the type, I guess...
        data[def.key] = "";
      }
    });
  });
</script>

<style>
  label {
    margin-right: 20px;
  }
</style>

<div class="data-editor-wrapper">
  {#each definition.fields as def, index}
    <div>
      <label for={def.key}>{def.name}</label>
    </div>
    <div>
      <input type="text" id={def.key} bind:value={data[def.key]} />
    </div>
  {/each}
</div>
