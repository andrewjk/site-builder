<script>
  import { createEventDispatcher } from "svelte";
  import Button from "../../../../svelte-toolkit/src/components/Button/Button.svelte";

  import Icon from "./Icon";
  import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
  import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";

  import DataEditor from "./DataEditor";

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
</style>

<div class="collection-editor-wrapper">
  <div class="expander">
    <div class="expander-title" on:click={e => (expanded = !expanded)}>
      <span class="expander-icon">
        <Icon icon={expanded ? faCaretDown : faCaretRight} />
      </span>
      <span>Item: {item.name}</span>
    </div>
    {#if expanded}
      <div class="expander-body">
        <div>
          <DataEditor {definition} data={item} />
          <Button
            class="full-width"
            type="danger"
            size="inline"
            title="Delete this item"
            on:click={e => deleteItem(item, index)}>
            <Icon icon={faTimes} />
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>
