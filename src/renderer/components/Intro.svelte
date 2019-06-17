<script>
  import { creatingSite, activeSite } from "../store/state";
  import Button from "../../../../svelte-toolkit/src/components/Button/Button.svelte";

  function startCreatingSite() {
    $creatingSite = true;
    $activeSite.info.name = "New Site";
    $activeSite.info.title = "New Site";
    $activeSite.info.intro = "";
  }
</script>

<style lang="scss">
  $create-color: #00b752;

  .intro-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .intro-inner-wrapper {
    max-width: 400px;
    text-align: center;
  }
</style>

<div class="intro-wrapper">
  <div class="intro-inner-wrapper">
    <p>
      Welcome to the site builder. You don't have any sites yet but you can
      create one by pressing the button below.
    </p>
    <Button class="full-width" size="large" type="success" on:click={startCreatingSite}>Create a site</Button>
  </div>
</div>
