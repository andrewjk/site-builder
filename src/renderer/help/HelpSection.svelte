<script>
  import SettingsHelp from "./SettingsHelp";
  import DataHelp from "./DataHelp";
  import PagesHelp from "./PagesHelp";
  import BlocksHelp from "./BlocksHelp";

  export let section = "";
</script>

<style>
  .help-container {
    padding: 20px;
  }
</style>

<template>
  <div class="help-container">
    {#if section === 'Settings'}
      <SettingsHelp />
    {:else if section === 'Data'}
      <DataHelp />
    {:else if section === 'Pages'}
      <PagesHelp />
    {:else if section === 'Blocks'}
      <BlocksHelp />
    {/if}
  </div>
</template>
