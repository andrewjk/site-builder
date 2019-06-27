<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import { Button, DialogButton } from "svelte-toolkit";

  export let id = null;
  export let className = null;
  export let content = "";
  export let callback = null;
  export let blocks = [];

  const dispatch = createEventDispatcher();

  let visible = true;
  let container = null;

  onMount(() => {
    // Focus the first button in the container
    const buttonElements = container.getElementsByTagName("button");
    if (buttonElements.length) {
      buttonElements[0].focus();
    }
  });

  function handleClick() {
    close(null);
  }

  function close(result) {
    visible = false;
    if (callback) {
      callback(result);
    }
    dispatch("closed");
  }
</script>

{#if visible}
  <div class="dialog-background" class:visible tabindex="-1">
    <div
      {id}
      class={['dialog', className].filter(Boolean).join(' ')}
      >
      <div class="dialog-body">
        <p>{content}</p>
        <div class="buttons-container" bind:this={container}>
          {#each blocks as block}
            <Button className="full-width" on:click={e => close(block)}>{block.name}</Button>
          {/each}
        </div>
      </div>
      <div class="dialog-footer">
        <DialogButton cancel={true} on:click={handleClick}>Cancel</DialogButton>
      </div>
    </div>
  </div>
{/if}
