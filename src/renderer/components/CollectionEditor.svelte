<script>
  import Button from "../../../../svelte-toolkit/src/components/Button/Button.svelte";
  import showConfirm from "../../../../svelte-toolkit/src/dialogs/Confirm/show-confirm";

  import Icon from "./Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
  import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";

  import DefinitionsEditor from "./DefinitionsEditor";
  import ItemEditor from "./ItemEditor";

  export let name = "";
  export let data = {};

  let expandDefinitions = false;

  function addItem() {
    const item = {};
    for (let i = 0; i < data.definitions.length; i++) {
      // TODO: From type e.g. numbers should be 0
      item[data.definitions[i].key] = "";
    }
    data.items.push(item);
    // HACK: Force reactivity
    data.items = data.items;
  }

  async function deleteItem(item, index) {
    const result = await showConfirm({
      content: "Are you sure you want to delete this item?",
      buttons: [
        { content: "Yes", confirm: true },
        { content: "No", cancel: true }
      ]
    });
    if (result) {
      data.items.splice(index, 1);
      // HACK: Force reactivity
      data.items = data.items;
    }
  }

  function defChanged() {
    // HACK: Force reactivity
    data.items = data.items;
  }
</script>

<style lang="scss">
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .expander-title {
    cursor: pointer;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .expander-icon {
    font-size: 14px;
  }

  .expander-body {
    margin-bottom: 20px;
  }
</style>

<div class="collection-editor-wrapper">
  <div class="title">Collection: {name}</div>

  <div class="expander">
    <div
      class="expander-title"
      on:click={e => (expandDefinitions = !expandDefinitions)}>
      <span class="expander-icon">
        <Icon icon={expandDefinitions ? faCaretDown : faCaretRight} />
      </span>
      <span>Fields</span>
    </div>
    {#if expandDefinitions}
      <div class="expander-body">
        <DefinitionsEditor
          collection={data.items}
          definitions={data.definitions}
          on:defchange={defChanged} />
      </div>
    {/if}
  </div>

  {#each data.items as item, index}
    <ItemEditor definition={data} {item} {index} on:delete={deleteItem} />
  {/each}

  <div class="edit-collection-buttons">
    <Button class="full-width" size="inline" title="Add an item" on:click={addItem}>
      <Icon icon={faPlus} />
    </Button>
  </div>
</div>
