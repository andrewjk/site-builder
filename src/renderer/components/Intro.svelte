<script>
  import { creatingSite, activeSite } from "../store/state";

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

  button {
    background-color: $create-color;
    border-radius: 4px;
    color: white;
    font-size: 32px;
    padding: 20px 40px;
    cursor: pointer;
  }

  button:hover {
    background-color: darken($create-color, 9%);
  }
</style>

<div class="intro-wrapper">
  <div class="intro-inner-wrapper">
    <p>
      Welcome to the site builder. You don't have any sites yet but you can
      create one by pressing the button below.
    </p>
    <button on:click={startCreatingSite}>Create a site</button>
  </div>
</div>
