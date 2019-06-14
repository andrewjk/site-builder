<script>
  import { tick } from "svelte";
  import {
    sections,
    activeSection,
    renamingSection,
    activeSite
  } from "../store/state";

  import Icon from "./Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

  import addCollection from "../store/add-collection";
  import addPage from "../store/add-page";
  import renameCollection from "../store/rename-collection";
  import renamePage from "../store/rename-page";
  import deleteCollection from "../store/delete-collection";
  import deletePage from "../store/delete-page";

  import showPrompt from "../../../../svelte-toolkit/src/dialogs/Prompt/show-prompt";
  import showConfirm from "../../../../svelte-toolkit/src/dialogs/Confirm/show-confirm";

  let input = null;
  let newName = "";

  async function handleInputKey(e, section) {
    if (e.key === "Enter") {
      await renameSomething(section);
    } else if (e.key === "Esc") {
      await toggleRenamingSomething(section);
    }
  }

  async function handleSectionKey(e, section) {
    if (
      section.key.startsWith("coll-") ||
      section.key.startsWith("page-")
    ) {
      if (e.key === "Delete") {
        await deleteSomething(section);
      } else if (e.key === "F2") {
        await toggleRenamingSomething(section);
      }
    }
  }

  function setActiveSection(section) {
    $activeSection = section;
    $sections.forEach(item => {
      item.selected = item.key === section.key;
    });
  }

  async function addSomething(section) {
    const key = section.key;
    if (key === "add-collection") {
      await maybeAddCollection(section);
    } else if (key === "add-page") {
      await maybeAddPage(section);
    }
  }

  async function maybeAddCollection(section) {
    const collectionName = await showPrompt({
      content: "Enter the new collection's name:"
    });
    if (collectionName) {
      const newSection = await addCollection(
        collectionName,
        $activeSite,
        $sections
      );
      $activeSection = newSection;
      // HACK: Force reactivity
      $sections = $sections;
    }
  }

  async function maybeAddPage(section) {
    const pageName = await showPrompt({
      content: "Enter the new page's name:"
    });
    if (pageName) {
      const newSection = await addPage(pageName, $activeSite, $sections);
      $activeSection = newSection;
      // HACK: Force reactivity
      $sections = $sections;
    }
  }

  async function deleteSomething(section) {
    const key = section.key;
    if (key.startsWith("coll-")) {
      await maybeDeleteCollection(section);
    } else if (key.startsWith("page-")) {
      await maybeDeletePage(section);
    }
  }

  async function maybeDeleteCollection(section) {
    const result = await showConfirm({
      content: "Are you sure you want to delete this data?",
      buttons: [
        { content: "Yes", confirm: true },
        { content: "No", cancel: true }
      ]
    });
    if (result) {
      const collection = section.collection;
      const oldSection = deleteCollection(
        collection,
        $activeSite.collections,
        $sections
      );
      $activeSection = oldSection;
      // HACK: Force reactivity
      $sections = $sections;
    }
  }

  async function maybeDeletePage(section) {
    const result = await showConfirm({
      content: "Are you sure you want to delete this page?",
      buttons: [
        { content: "Yes", confirm: true },
        { content: "No", cancel: true }
      ]
    });
    if (result) {
      const page = section.page;
      const oldSection = deletePage(page, $activeSite.pages, $sections);
      $activeSection = oldSection;
      // HACK: Force reactivity
      $sections = $sections;
    }
  }

  async function toggleRenamingSomething(section) {
    newName = section.text;
    if ($renamingSection) {
      $renamingSection = null;
    } else {
      $renamingSection = section;
      await tick();
      input.focus();
    }
  }

  async function renameSomething(section) {
    const key = section.key;
    if (key.startsWith("coll-")) {
      const collection = section.collection;
      renameCollection(collection, newName, $sections);
    } else if (key.startsWith("page-")) {
      const page = section.page;
      renamePage(page, newName, $sections);
    }
    $renamingSection = null;
  }
</script>

<style lang="scss">
  .side-bar-wrapper {
    background-color: #2d2d2d;
    color: #eee;
    height: 100%;
    width: 120px;
    overflow: hidden;
    padding: 0 10px;
  }

  .side-bar-title,
  .side-bar-section {
    button {
      border: 1px solid transparent;
      border-radius: 2px;
      color: inherit;
      text-align: left;
      width: 100%;
    }
    button:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
    button:focus {
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
  }

  .side-bar-title {
    button {
      background-color: inherit;
      color: #bbb;
      font-size: 13px;
      margin: 5px 0;
      padding: 6px 4px;
      text-transform: uppercase;
    }
  }

  .side-bar-section {
    button {
      background-color: inherit;
      padding: 4px 9px;
    }
  }

  .side-bar-title.selected,
  .side-bar-section.selected {
    button {
      color: orange;
    }
  }
</style>

<div class="side-bar-wrapper">
  {#each $sections as section (section.key)}
    {#if section.class === 'title'}
      <div class="side-bar-title" class:selected={section === $activeSection}>
        <button on:click={e => setActiveSection(section)}>
           {section.text}
        </button>
      </div>
    {:else if section.class === 'item'}
      <div class="side-bar-section" class:selected={section === $activeSection}>
        {#if section === $renamingSection}
          <input
            type="text"
            bind:value={newName}
            on:keydown={e => handleInputKey(e, section)}
            bind:this={input} />
        {:else}
          <button
            on:click={e => setActiveSection(section)}
            on:keydown={e => handleSectionKey(e, section)}>
             {section.text}
          </button>
        {/if}
      </div>
    {:else if section.class === 'add'}
      <div class="side-bar-section add-button">
        <button on:click={e => addSomething(section)}>
          <Icon icon={faPlus} />
        </button>
      </div>
    {/if}
  {/each}
</div>
