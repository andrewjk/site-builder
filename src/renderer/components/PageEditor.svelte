<script>
  import { onMount, beforeUpdate } from "svelte";
  import { activeSite, definitions } from "../store/state";

  import electron from "electron";
  import path from "path";

  import { Button, showConfirm } from "svelte-toolkit";

  import Icon from "./Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
  import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";

  import DataEditor from "./DataEditor";

  import buildPageEditorHtml from "../store/build-page-editor-html";
  import showSelectBlockDialog from "../store/show-select-block-dialog";

  export let page = {};
  export let definition = {};
  export let settings = {};

  let expandSettings = false;
  let pageFile = "";
  let webview = null;
  let preload = "file:///" + path.join(__static, "/page-editor.js");
  let activeBlock = null;
  let activeInput = null;
  let activeField = null;

  onMount(async () => {
    // await buildPageEditorHtml($activeSite, page, $activeSite.blocks, $definitions);
    // pageFile = "file:///" + page.tempFile.replace(/ /g, '%20').replace(/\\/g, '/');
    setupWebviewListeners();
  });

  beforeUpdate(async () => {
    if (!page.tempFile) {
      await buildPageEditorHtml(
        $activeSite,
        page,
        $activeSite.blocks,
        $definitions
      );
    }
    pageFile = "file:///" + page.tempFile;
  });

  async function addBlock() {
    const templateBlock = await showSelectBlockDialog({
      content: "Select the type of block that you'd like to add:",
      blocks: $activeSite.blocks
    });
    if (templateBlock) {
      const block = { name: templateBlock.name, data: {} };
      // For data blocks, add the definition fields as divs that can be edited by the user
      if (block.name === "data-item" && page.settings.data) {
        const collection = $activeSite.collections.find(
          item =>
            item.name &&
            item.name.localeCompare(page.settings.data, undefined, {
              sensitivity: "accent"
            }) === 0
        );
        if (!collection) {
          // TODO: Throw and log properly
          console.log(
            "Collection not found: " + page.settings.data + " in " + page.name
          );
        }

        if (collection) {
          block.html = collection.data.fields
            .map(def => {
              return `<div id="data-field-${
                def.key
              }" class="data-field" data-field-key="${
                def.key
              }" draggable="true">{{ item.${def.key} }}</div>`;
            })
            .join("\n");
        }
      }
      page.blocks.push(block);
      await rebuildPageEditorHtml();
    }
  }

  async function rebuildPageEditorHtml() {
    await buildPageEditorHtml(
      $activeSite,
      page,
      $activeSite.blocks,
      $definitions
    );
    webview.reload();
  }

  function setupWebviewListeners() {
    // Listen to console messages from within the webview (handy for debugging the webview-preload script)
    // But only listen to messages that start with a $ because those will be the ones that we have made
    webview.addEventListener("console-message", e => {
      if (e.message.startsWith("$")) {
        console.log("WEBVIEW:", e.message.substring(1));
      }
    });

    // Listen to changes to inputs and update the corresponding block data
    electron.remote.ipcMain.on(
      "block-input-changed",
      async (event, { pageId, blockId, data }) => {
        if (pageId === page.id) {
          const block = page.blocks.find(block => block.id === blockId);
          Object.assign(block.data, data);
        }
      }
    );

    // Listen to block changes
    electron.remote.ipcMain.on(
      "move-block",
      async (event, { pageId, blockId, beforeBlockId }) => {
        if (pageId === page.id) {
          const index = page.blocks.findIndex(block => block.id === blockId);
          if (index !== -1) {
            if (beforeBlockId) {
              const beforeIndex = page.blocks.findIndex(
                block => block.id === beforeBlockId
              );
              page.blocks.splice(
                beforeIndex,
                0,
                page.blocks.splice(index, 1)[0]
              );
            } else {
              page.blocks.splice(
                page.blocks.length,
                0,
                page.blocks.splice(index, 1)[0]
              );
            }
          }
        }
      }
    );
    electron.remote.ipcMain.on(
      "delete-block",
      async (event, { pageId, blockId }) => {
        if (pageId === page.id) {
          const result = await showConfirm({
            content: "Are you sure you want to delete this block?",
            buttons: [
              { content: "Yes", confirm: true },
              { content: "No", cancel: true }
            ]
          });
          if (result) {
            const index = page.blocks.findIndex(block => block.id === blockId);
            page.blocks.splice(index, 1);
            event.sender.send("confirm-delete-block", { blockId });
          }
        }
      }
    );
    electron.remote.ipcMain.on(
      "select-block",
      async (event, { pageId, blockId }) => {
        if (pageId === page.id) {
          activeBlock = page.blocks.find(block => block.id === blockId);
          activeInput = null;
          activeField = null;
        }
      }
    );

    // Listen to input changes
    electron.remote.ipcMain.on(
      "select-input",
      async (event, { pageId, blockId, key }) => {
        if (pageId === page.id) {
          activeBlock = page.blocks.find(block => block.id === blockId);
          activeInput = activeBlock.definition.fields.find(
            field => field.key === key
          );
          // Set the data for this input if it hasn't already been set
          if (!activeBlock.data.settings[key]) {
            activeBlock.data.settings[key] = {};
          }
          activeField = null;
        }
      }
    );

    // Listen to field changes
    electron.remote.ipcMain.on(
      "move-field",
      async (event, { pageId, blockId, html }) => {
        if (pageId === page.id) {
          // HACK: Do this more elegantly
          const block = page.blocks.find(block => block.id === blockId);
          block.html = html;
        }
      }
    );
    electron.remote.ipcMain.on(
      "select-field",
      async (event, { pageId, blockId, fieldKey }) => {
        if (pageId === page.id) {
          activeBlock = page.blocks.find(block => block.id === blockId);
          // TODO: Get activeField from the associated collection
          activeInput = null;
        }
      }
    );
  }

  function handlePageChange(e) {
    webview.send("changed-page-setting", {
      style: e.detail,
      value: $activeSite.appearance[e.detail],
      appliesTo: $definitions.appearance.fields.find((item) => item.key === e.detail).appliesTo
    });
  }

  function handleBlockChange(e) {
    webview.send("changed-block-setting", {
      blockId: activeBlock.id,
      style: e.detail,
      value: activeBlock.data.settings[e.detail]
    });
  }

  function handleInputChange(e) {
    webview.send("changed-input-setting", {
      blockId: activeBlock.id,
      key: activeInput.key,
      style: e.detail,
      value: activeBlock.data.settings[activeInput.key][e.detail]
    });
  }
</script>

<style lang="scss" scoped>
  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .page-editor-wrapper {
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    height: 100%;
  }

  .expander-title {
    cursor: pointer;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .expander-icon {
    font-size: 14px;
  }

  .expander-body {
    margin-bottom: 20px;
  }

  .page-block-editor-wrapper {
    display: grid;
    grid-template-columns: 1fr 200px;
    grid-column-gap: 20px;
  }

  .page-block-editor {
    min-height: 400px;
    margin-bottom: 20px;
  }
</style>

<div class="page-editor-wrapper">
  <div class="title">{page.name}</div>

  <div class="expander">
    <div
      class="expander-title"
      on:click={e => (expandSettings = !expandSettings)}>
      <span class="expander-icon">
        <Icon icon={expandSettings ? faCaretDown : faCaretRight} />
      </span>
      <span>Settings</span>
    </div>
    {#if expandSettings}
      <div class="expander-body">
        <DataEditor {definition} data={settings} />
      </div>
    {/if}
  </div>

  <div class="page-block-editor-wrapper">
    <webview
      class="page-block-editor"
      src={pageFile}
      {preload}
      autosize
      minwidth="0"
      minheight="0"
      bind:this={webview} />

    <div class="page-block-props">
      <h4>Site</h4>
      <DataEditor
        definition={$definitions.appearance}
        data={$activeSite.appearance}
        on:change={handlePageChange} />
      {#if activeBlock}
        <h4>{activeBlock.name}</h4>
        <DataEditor
          definition={$definitions.block}
          data={activeBlock.data.settings}
          on:change={handleBlockChange} />
      {/if}
      {#if activeInput}
        <h4>{activeInput.name}</h4>
        <DataEditor
          definition={$definitions.input}
          data={activeBlock.data.settings[activeInput.key]}
          on:change={handleInputChange} />
      {/if}
      {#if activeField}
        <h4>{activeField.name}</h4>
      {/if}
    </div>
  </div>

  <Button
    class="full-width"
    size="inline"
    title="Add a block"
    on:click={addBlock}>
    <Icon icon={faPlus} />
  </Button>
</div>
