<script>
  import DefinitionsEditor from "./DefinitionsEditor";
  import DataEditor from "./DataEditor";

  import Icon from "./Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
  import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";

  export let name = "";
  export let data = {};

  let expandDefinitions = false;
  let expandItems = false;

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
</script>

<style lang="scss">
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 16px;
    margin: 8px 0;
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

  .edit-collection-buttons {
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
          definitions={data.definitions} />
      </div>
    {/if}
  </div>

  <div class="expander">
    <div class="expander-title" on:click={e => (expandItems = !expandItems)}>
      <span class="expander-icon">
        <Icon icon={expandItems ? faCaretDown : faCaretRight} />
      </span>
      <span>
         {data.items.length === 1 ? data.items.length + ' Item' : data.items.length + ' Items'}

      </span>
    </div>
    {#if expandItems}
      <div class="expander-body">
        {#each data.items as item, index}
          <div>
            <div class="subtitle">Item {index + 1}</div>
            <DataEditor definition={data} data={item} />
          </div>
        {/each}
        <div class="edit-collection-buttons">
          <button title="Add an item" on:click={addItem}>
            <Icon icon={faPlus} />
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
