<script>
  export let definitions = [];
  export let collection = [];

  import Icon from "./Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

  function addDefinition() {
    definitions.push({
      key: "",
      name: "",
      type: "text"
    });
    // HACK: Force reactivity
    definitions = definitions;
  }

  function setKey(e, definition) {
    const oldKey = definition.key;
    const newKey = e.target.value;
    definition.key = newKey;
    // Update items in the collection with this new key
    collection.forEach(item => {
      item[newKey] = item[oldKey];
      item[oldKey] = undefined;
    });
  }
</script>

<style lang="scss">
  .edit-definition-buttons {
    button {
      background-color: #ddd;
      border: 1px solid transparent;
      border-radius: 2px;
      color: inherit;
      padding: 10px;
      width: 100%;
    }
    button:hover {
      background-color: darken(#ddd, 9%);
    }
    button:focus {
      border: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
</style>

<div class="definitions-editor-wrapper">
  <table>
    <thead>
      <tr>
        <td>Key</td>
        <td>Name</td>
        <td>Type</td>
      </tr>
    </thead>
    <tbody>
      {#each definitions as def, index}
        <tr>
          <td>
            <input type="text" value={def.key} on:input={e => setKey(e, def)} />
          </td>
          <td>
            <input type="text" bind:value={def.name} />
          </td>
          <td>
            <input type="text" bind:value={def.type} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="edit-definition-buttons">
    <button title="Add a definition" on:click={addDefinition}>
      <Icon icon={faPlus} />
    </button>
  </div>
</div>
