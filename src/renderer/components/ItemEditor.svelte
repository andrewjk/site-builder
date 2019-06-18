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

  let expanded = false;

  const dispatch = createEventDispatcher();

  async function deleteItem(item) {
    dispatch("delete", item);
  }
</script>

<style lang="scss">
</style>

<div class="collection-editor-wrapper">
  <DataEditor {definition} data={item} />
  <Button
    class="full-width"
    type="danger"
    size="inline"
    title="Delete this item"
    on:click={e => deleteItem(item)}>
    <Icon icon={faTimes} />
  </Button>
</div>
