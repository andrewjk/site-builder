<script>
  import { beforeUpdate } from "svelte";

  export let definition = null;
  export let data = null;

  beforeUpdate(() => {
    // Update data from the definition, just in case it hasn't been loaded or the template has changed
    definition.definitions.forEach(def => {
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
  <table>
    <tbody>
      {#each definition.definitions as def, index}
        <tr>
          <td>
            <label for={def.key}>{def.name}</label>
          </td>
          <td>
            <input type="text" id={def.key} bind:value={data[def.key]} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
