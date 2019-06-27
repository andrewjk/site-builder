<script>
  import {
    creatingSite,
    sites,
    activeSite,
    definitions,
    sections,
    activeSection
  } from "../store/state";
  import { Button } from "svelte-toolkit";

  import createSite from "../store/create-site";
  import loadSite from "../store/load-site";

  let name = "";
  let title = "";
  let description = "";
  let logo = "";
  let icon = "";
  let bannerImage = "";
  let bannerTitle = "";
  let bannerText = "";

  async function handleCreateSite() {
    await createSite(
      name,
      {
        name,
        title,
        description,
        logo,
        icon,
        bannerImage,
        bannerTitle,
        bannerText
      },
      {
        // Empty appearance, for now...
      }
    );
    $activeSite = await loadSite(name);
    $creatingSite = false;
    $sites.push(name);
    $sections = buildSections($activeSite, $definitions);
    $activeSection = null;
  }

  function logoSelected(e) {
    logo = e.target.files[0].path;
  }

  function iconSelected(e) {
    icon = e.target.files[0].path;
  }

  function bannerSelected(e) {
    bannerImage = e.target.files[0].path;
  }
</script>

<style lang="scss" scoped>
  $create-color: #00b752;

  .wizard-wrapper {
    margin: 40px;
    max-width: 800px;
  }

  .wizard-step {
    margin-bottom: 40px;
  }

  .wizard-info {
    color: #888;
  }
</style>

<div class="wizard-wrapper">
  <div class="wizard-step">
    <h2>Site Name</h2>
    <p class="wizard-info">
      The name of this site - it's just used for saving and loading files and
      won't be displayed anywhere online.
    </p>
    <div class="wizard-input">
      <input type="text" bind:value={name} />
    </div>
  </div>
  <div class="wizard-step">
    <h2>Title</h2>
    <p class="wizard-info">
      The title of this site to be displayed in the browser's title bar and main
      heading.
    </p>
    <div class="wizard-input">
      <input type="text" bind:value={title} />
    </div>
  </div>
  <div class="wizard-step">
    <h2>Description</h2>
    <p class="wizard-info">
      A description of this site to help people find it.
    </p>
    <div class="wizard-input">
      <textarea bind:value={description} />
    </div>
  </div>
  <div class="wizard-step">
    <h2>Logo</h2>
    <p class="wizard-info">
      The logo of your business, organisation or product to be displayed in the
      header. It should be a PNG file, at least ? px tall.
    </p>
    <div class="wizard-input">
      <input type="file" bind:value={logo} on:change={logoSelected} />
    </div>
  </div>
  <div class="wizard-step">
    <h2>Icon</h2>
    <p class="wizard-info">
      An icon to be displayed in the browser's title bar. It should be a PNG
      file, at least ? px square.
    </p>
    <div class="wizard-input">
      <input type="file" bind:value={icon} on:change={iconSelected} />
    </div>
  </div>
  <div class="wizard-step">
    <h2>Banner Image (optional)</h2>
    <p class="wizard-info">
      A large banner to be displayed along the top of the site's main page. It
      should be a JPG file, at least ? px wide.
    </p>
    <div class="wizard-input">
      <input type="file" bind:value={bannerImage} on:change={bannerSelected} />
    </div>
  </div>
  <div class="wizard-step">
    <h2>Banner Title (optional)</h2>
    <p class="wizard-info">
      A title to display over the top of the banner image.
    </p>
    <div class="wizard-input">
      <input type="text" bind:value={bannerTitle} />
    </div>
  </div>
  <div class="wizard-step">
    <h2>Banner Text (optional)</h2>
    <p class="wizard-info">
      Some text to display over the top of the banner image, underneath the
      title.
    </p>
    <div class="wizard-input">
      <textarea bind:value={bannerText} />
    </div>
  </div>
  <Button
    class="full-width"
    size="large"
    type="success"
    on:click={handleCreateSite}>
    Create site
  </Button>
</div>
