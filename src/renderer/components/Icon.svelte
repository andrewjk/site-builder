<script>
  // TODO: Add this from the fa-svelte package when it's been updated to work with Svelte v3
  export let icon;

  $: viewBox = "0 0 " + icon.icon[0] + " " + icon.icon[1];
  $: classes = "fa-svelte " + ($$props.class ? $$props.class : "");
  $: path = icon.icon[4];
</script>

<style>
  .fa-svelte {
    width: 1em;
    height: 1em;
    overflow: visible;
    display: inline-block;
    vertical-align: baseline;
  }
</style>

<svg
  aria-hidden="true"
  class={classes}
  role="img"
  xmlns="http://www.w3.org/2000/svg"
  {viewBox}>
  <path fill="currentColor" d={path} />
</svg>
