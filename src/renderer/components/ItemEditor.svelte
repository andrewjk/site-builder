<script>
  import { createEventDispatcher } from "svelte";

  import DataEditor from "./DataEditor";

  import Icon from "./Icon";
  import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
  import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";

  export let definition;
  export let item = {};
  export let index = 0;

  let expanded = false;

  const dispatch = createEventDispatcher();

  async function deleteItem(item, index) {
    dispatch("delete", item, index);
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
</style>

<div class="collection-editor-wrapper">
  <div class="expander">
    <div class="expander-title" on:click={e => (expanded = !expanded)}>
      <span class="expander-icon">
        <Icon icon={expanded ? faCaretDown : faCaretRight} />
      </span>
      <span>Item {index + 1}</span>
      {@debug item}
    </div>
    {#if expanded}
      <div class="expander-body">
        <div>
          <DataEditor {definition} data={item} />
          <button
            title="Delete this item"
            on:click={e => deleteItem(item, index)}>
            <Icon icon={faTimes} />
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
