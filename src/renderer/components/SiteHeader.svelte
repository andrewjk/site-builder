<script>
  import settings from "electron-settings";
  import {
    sites,
    creatingSite,
    activeSite,
    activeSection,
    sections,
    definitions
  } from "../store/state";

  import loadSite from "../store/load-site";
  import buildSections from "../store/build-sections";
  import saveSite from "../store/save-site";
  import buildSite from "../store/build-site";

  let siteName = $activeSite ? $activeSite.info.name : "Loading";

  async function loadOrCreateSite() {
    // HACK: Tildes ensure that it's not something that a user can create
    if (siteName === "~Create~") {
      $creatingSite = true;
    } else {
      $creatingSite = false;
      $activeSite = await loadSite(siteName);
      $sections = buildSections($activeSite, $definitions);
      settings.set("app", { siteName });
    }
  }
</script>

<style>
  .header-wrapper {
    background-color: #2d2d2d;
    color: #eee;
    padding: 20px 10px;
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    grid-column-gap: 10px;
    align-items: center;
  }

  h1 {
    margin: 0;
  }

  button {
    background-color: white;
    border: none;
    border-radius: 2px;
    color: #222;
    padding: 6px 10px;
  }

  button:hover,
  button:focus {
    background-color: #ccc;
  }

  select {
    border: 0;
    border-radius: 2px;
    color: #222;
    padding: 5px 5px;
  }
</style>

<div class="header-wrapper">
  <h1>{$activeSite ? $activeSite.info.name : 'Loading'}</h1>
  {#if $sites.length}
    <select bind:value={siteName} on:change={loadOrCreateSite}>
      {#each $sites as site (site)}
        <option value={site}>{site}</option>
      {/each}
      <option value="~Create~">Create a Site</option>
    </select>
  {/if}
  <button type="button" on:click={e => saveSite($activeSite)}>Save</button>
  <button type="button" on:click={e => buildSite($activeSite, $definitions)}>Build</button>
</div>
