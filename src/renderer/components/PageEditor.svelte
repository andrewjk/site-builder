<script>
  import { onMount, beforeUpdate } from "svelte";
  import { activeSite } from "../store/state";

  import electron from "electron";
  import path from "path";
  import buildPageEditorHtml from "../store/build-page-editor-html";
  import showSelectBlockDialog from "../store/show-select-block-dialog";

  import DataEditor from "./DataEditor";
  import Icon from "./Icon";
  import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
  import { faCaretRight } from "@fortawesome/free-solid-svg-icons/faCaretRight";

  export let page = {};
  export let definition = {};
  export let data = {};

  let expandSettings = false;
  let pageFile = "";
  let webview = null;
  let preload = "file:///" + path.join(__static, "/page-editor.js");

  onMount(async () => {
    // await buildPageEditorHtml($activeSite, page, $activeSite.blocks);
    // pageFile = "file:///" + page.tempFile.replace(/ /g, '%20').replace(/\\/g, '/');
    setupWebviewListeners();
  });

  beforeUpdate(async () => {
    if (!page.tempFile) {
      await buildPageEditorHtml($activeSite, page, $activeSite.blocks);
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
      page.blocks.push(block);
      await rebuildPageEditorHtml();
    }
  }

  async function rebuildPageEditorHtml() {
    await buildPageEditorHtml($activeSite, page, $activeSite.blocks);
    webview.reload();
  }

  function setupWebviewListeners() {
    // Listen to console messages from within the webview (handy for debugging the webview-preload script)
    // But only listen to messages that start with a $ because those will be the ones that we have made
    webview.addEventListener("console-message", e => {
      if (e.message.indexOf("$") === 0) {
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

    // Listen to button clicks
    electron.remote.ipcMain.on(
      "move-block-up",
      async (event, { pageId, blockId }) => {
        if (pageId === page.id) {
          const index = page.blocks.findIndex(block => block.id === blockId);
          if (index > 0) {
            page.blocks.splice(index - 1, 0, page.blocks.splice(index, 1)[0]);
          }
        }
      }
    );
    electron.remote.ipcMain.on(
      "move-block-down",
      async (event, { pageId, blockId }) => {
        if (pageId === page.id) {
          const index = page.blocks.findIndex(block => block.id === blockId);
          if (index < page.blocks.length - 1) {
            page.blocks.splice(index + 1, 0, page.blocks.splice(index, 1)[0]);
          }
        }
      }
    );
    electron.remote.ipcMain.on(
      "delete-block",
      async (event, { pageId, blockId }) => {
        if (pageId === page.id) {
          const dialog = create(ConfirmDialog);
          const result = await dialog({
            content: "Are you sure you want to delete this block?",
            confirmText: "Yes",
            cancelText: "No"
          }).transition();
          if (result) {
            const index = page.blocks.findIndex(block => block.id === blockId);
            page.blocks.splice(index, 1);
            event.sender.send("confirm-delete-block", { blockId });
          }
        }
      }
    );
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

  .page-block-editor {
    min-height: 400px;
    margin-bottom: 20px;
  }

  .edit-block-buttons {
    button {
      background-color: #ddd;
      border: 1px solid transparent;
      border-radius: 2px;
      color: inherit;
      padding: 10px;
      width: 100%;
    }
    button:hover {
      background-color: darken(#ddd, 9%);
    }
    button:focus {
      border: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
</style>

<div class="page-editor-wrapper">
  <div class="title">Page: {page.name}</div>

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
        <DataEditor {definition} {data} />
      </div>
    {/if}
  </div>

  <webview
    class="page-block-editor"
    src={pageFile}
    {preload}
    autosize
    minwidth="0"
    minheight="0"
    bind:this={webview} />

  <div class="edit-block-buttons">
    <button title="Add a block" on:click={addBlock}>
      <Icon icon={faPlus} />
    </button>
  </div>
</div>