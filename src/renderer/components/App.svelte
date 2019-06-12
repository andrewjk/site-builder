<script>
  import { onMount } from "svelte";
  import {
    sites,
    activeSite,
    definitions,
    creatingSite,
    sections,
    activeSection
  } from "../store/state";

  import loadAllSites from "../store/load-all-sites";
  import loadSite from "../store/load-site";
  import loadDefinitionFiles from "../store/load-definition-files";
  import buildSections from "../store/build-sections";

  import SiteHeader from "./SiteHeader";
  import SideBar from "./SideBar";

  import Intro from "./Intro";
  import NewSiteWizard from "./NewSiteWizard";
  import HelpSection from "../help/HelpSection";
  import SettingsEditor from "./SettingsEditor";
  import CollectionEditor from "./CollectionEditor";
  import PageEditor from "./PageEditor";
  import BlockEditor from "./BlockEditor";

  onMount(async () => {
    $sites = await loadAllSites();
    // Load the first site
    // TODO: Should load the previous site used
    $activeSite = await loadSite($sites[0]);
    $definitions = await loadDefinitionFiles();
    $sections = buildSections($activeSite, $definitions);
  });
</script>

<style>
  .body-wrapper {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100vh;
  }

  main {
    display: grid !important;
    grid-template-columns: auto 1fr;
  }

  .editor-container {
    padding: 20px;
  }
</style>

<div class="body-wrapper">
  <header>
    <SiteHeader />
  </header>
  <main>
    {#if $sites.length && !$creatingSite}
      <div class="side-bar-container">
        <SideBar />
      </div>
    {/if}
    <div class="editor-container">

      {#if !$sites.length && !$creatingSite}
        <Intro />
      {:else if $creatingSite}
        <NewSiteWizard />
      {:else if $activeSection && $activeSection.type === 'title'}
        <HelpSection section={$activeSection.text} />
      {:else if $activeSection && $activeSection.type === 'settings'}
        <SettingsEditor
          name={$activeSection.name}
          definition={$activeSection.definition}
          data={$activeSection.data}
          @save="saveSettings(activeSection)"
          @cancel="cancelSettings(activeSection)" />
      {:else if $activeSection && $activeSection.type === 'collection'}
        <CollectionEditor
          name={$activeSection.text}
          data={$activeSection.data}
          @save="saveData(activeSection)"
          @cancel="cancelData(activeSection)" />
      {:else if $activeSection && $activeSection.type === 'page'}
        <PageEditor
          page={$activeSection.page}
          definition={$activeSection.definition}
          data={$activeSection.data}
          @save="savePage(activeSection)"
          @cancel="cancelPage(activeSection)" />
      {:else if $activeSection && $activeSection.type === 'block'}
        <BlockEditor
          block={$activeSection.block}
          definition={$activeSection.definition}
          data={$activeSection.data}
          @save="saveBlock(activeSection)"
          @cancel="cancelBlock(activeSection)" />
      {/if}
    </div>
  </main>
</div>
