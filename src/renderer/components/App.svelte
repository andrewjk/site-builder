<script>
  import { onMount } from "svelte";
  import settings from "electron-settings";
  import {
    sites,
    activeSite,
    definitions,
    creatingSite,
    sections,
    activeSection
  } from "../store/state";

  import loadAllSites from "../store/load-all-sites";
  import siteExists from "../store/site-exists";
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

  let loaded = false;

  onMount(async () => {
    $sites = await loadAllSites();
    // Load the previous site used, if it still exists
    let siteName = settings.get("app.siteName");
    if (!siteExists(siteName)) {
      siteName = $sites[0];
    }
    $activeSite = await loadSite(siteName);
    $definitions = await loadDefinitionFiles();
    $sections = buildSections($activeSite, $definitions);
    loaded = true;
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
  {#if loaded}
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
            data={$activeSection.data} />
        {:else if $activeSection && $activeSection.type === 'collection'}
          <CollectionEditor
            name={$activeSection.text}
            data={$activeSection.data} />
        {:else if $activeSection && $activeSection.type === 'page'}
          <PageEditor
            page={$activeSection.page}
            definition={$activeSection.definition}
            settings={$activeSection.data} />
        {:else if $activeSection && $activeSection.type === 'block'}
          <BlockEditor
            block={$activeSection.block}
            definition={$activeSection.definition}
            data={$activeSection.data} />
        {/if}
      </div>
    </main>
  {:else}
    <div class="editor-container">
      <p class="text-center">Loading sites...</p>
    </div>
  {/if}
</div>
