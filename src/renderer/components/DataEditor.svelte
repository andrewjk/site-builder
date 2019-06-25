<script>
  import { beforeUpdate, createEventDispatcher } from "svelte";
  import { activeSite } from "../store/state";

  export let definition = null;
  export let data = null;

  const dispatch = createEventDispatcher();

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
      {#if def.type === 'layout'}
        <select
          id={def.key}
          bind:value={data[def.key]}
          on:change={e => dispatch('change', def.key)}>
          <option value="">-</option>
          {#each $activeSite.pages.filter(p =>
            p.name.startsWith('_')
          ) as layout (layout.name)}
            <option>{layout.name}</option>
          {/each}
        </select>
      {:else if def.type === 'collection'}
        <select
          id={def.key}
          bind:value={data[def.key]}
          on:change={e => dispatch('change', def.key)}>
          <option value="">-</option>
          {#each $activeSite.collections as coll (coll.name)}
            <option>{coll.name}</option>
          {/each}
        </select>
      {:else}
        <input
          type="text"
          id={def.key}
          bind:value={data[def.key]}
          on:change={e => dispatch('change', def.key)} />
      {/if}
    </div>
  {/each}
</div>
