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

  let showFields = true;
  let itemName = "~Fields~";
  let activeItem = null;
  let search = "";

  $: items = data.items.filter(item =>
    item.name.match(
      // Escape invalid regex chars and do a case-insensitive search
      new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i")
    )
  );

  async function selectItem() {
    // HACK: Tildes ensure that it's not something that a user can create
    if (itemName[0] === "~Fields~") {
      showFields = true;
    } else {
      showFields = false;
      activeItem = data.items.find(item => item.name === itemName[0]);
    }
  }

  function addItem() {
    search = "";
    const item = {};
    for (let i = 0; i < data.fields.length; i++) {
      // TODO: From type e.g. numbers should be 0
      item[data.fields[i].key] = "";
    }
    data.items.push(item);
    showFields = false;
    activeItem = item;
    // HACK: Force reactivity
    data.items = data.items;
  }

  async function deleteItem(item) {
    const result = await showConfirm({
      content: "Are you sure you want to delete this item?",
      buttons: [
        { content: "Yes", confirm: true },
        { content: "No", cancel: true }
      ]
    });
    if (result) {
      const index = data.items.indexOf(item);
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
  .collection-editor-wrapper {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-column-gap: 20px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }
</style>

<div class="collection-editor-wrapper">
  <div class="collection-list">
    <div class="title">{name}</div>
    <div class="block">
      <label for="search">Search:</label>
      <input id="search" type="text" bind:value={search} />
    </div>
    <div class="block">
      <select
        multiple
        size="10"
        bind:value={itemName}
        on:change={selectItem}>
        <option value="~Fields~">Fields</option>
        {#each items as item, index (item.name)}
          <option value={item.name}>{item.name}</option>
        {/each}
      </select>
    </div>
    <div class="edit-collection-buttons">
      <Button
        class="full-width"
        size="inline"
        title="Add an item"
        on:click={addItem}>
        <Icon icon={faPlus} />
      </Button>
    </div>
  </div>

  <div class="collection-item">
    {#if showFields}
      <div class="title">Fields</div>
      <DefinitionsEditor
        collection={data.items}
        definitions={data.fields}
        on:defchange={defChanged} />
    {:else if activeItem}
      <div class="title">{activeItem.name}</div>
      <ItemEditor definition={data} item={activeItem} on:delete={deleteItem} />
    {/if}
  </div>
</div>
