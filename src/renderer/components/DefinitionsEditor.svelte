<script>
  import { createEventDispatcher } from "svelte";
  import Button from "../../../../svelte-toolkit/src/components/Button/Button.svelte";
  import showConfirm from "../../../../svelte-toolkit/src/dialogs/Confirm/show-confirm";

  import Icon from "./Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
  import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
  import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";

  export let definitions = [];
  export let collection = [];

  const dispatch = createEventDispatcher();

  function addDefinition() {
    definitions.push({
      key: "",
      name: "",
      type: "text"
    });
    // HACK: Force reactivity
    definitions = definitions;
    dispatch("defchange");
  }

  async function deleteDefinition(def, index) {
    const result = await showConfirm({
      content: "Are you sure you want to delete this definition?",
      buttons: [
        { content: "Yes", confirm: true },
        { content: "No", cancel: true }
      ]
    });
    if (result) {
      definitions.splice(index, 1);
      // Update items in the collection
      collection.forEach(item => {
        item[def.key] = undefined;
      });
      // HACK: Force reactivity
      definitions = definitions;
      dispatch("defchange");
    }
  }

  function moveDefinitionDown(def, index) {
    if (index < definitions.length - 1) {
      definitions.splice(index + 1, 0, definitions.splice(index, 1)[0]);
      // HACK: Force reactivity
      definitions = definitions;
      dispatch("defchange");
    }
  }

  function moveDefinitionUp(def, index) {
    // NOTE: Don't allow moving the Name field
    if (index > 1) {
      definitions.splice(index - 1, 0, definitions.splice(index, 1)[0]);
      // HACK: Force reactivity
      definitions = definitions;
      dispatch("defchange");
    }
  }

  function setKey(e, definition) {
    const oldKey = definition.key;
    const newKey = e.target.value.replace(/\W+/g, "_").toLowerCase();
    definition.key = newKey;
    // Update items in the collection with this new key
    collection.forEach(item => {
      item[newKey] = item[oldKey];
      item[oldKey] = undefined;
    });
    dispatch("defchange");
  }
</script>

<style lang="scss">

</style>

<div class="definitions-editor-wrapper">
  <table>
    <thead>
      <tr>
        <td>Name</td>
        <td>Type</td>
      </tr>
    </thead>
    <tbody>
      {#each definitions as def, index}
        <tr>
          <td>
            <input
              type="text"
              bind:value={def.name}
              on:input={e => setKey(e, def)} />
          </td>
          <td>
            <input type="text" bind:value={def.type} />
          </td>
          <td>
            {#if def.name !== 'Name'}
              <Button
                size="inline"
                title="Move this field down"
                on:click={e => moveDefinitionDown(def, index)}>
                <Icon icon={faCaretDown} />
              </Button>
              <Button
                size="inline"
                title="Move this field up"
                on:click={e => moveDefinitionUp(def, index)}>
                <Icon icon={faCaretUp} />
              </Button>
              <Button
                type="danger"
                size="inline"
                title="Delete this field"
                on:click={e => deleteDefinition(def, index)}>
                <Icon icon={faTimes} />
              </Button>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="edit-definition-buttons">
    <Button
      class="full-width"
      size="inline"
      title="Add a definition"
      on:click={addDefinition}>
      <Icon icon={faPlus} />
    </Button>
  </div>
</div>
