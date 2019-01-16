<template>
  <div id="app">
    <router-view></router-view>

    <!-- Wrapper for ModalDialogs -->
    <dialogs-wrapper transition-name="dialog-fade"></dialogs-wrapper>
  </div>
</template>

<script>
  export default {
    name: 'SiteBuilder'
  }
</script>

<style>

  *, *:before, *:after {
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
  }

  p {
    line-height: 24px;
  }

  h1 {
    font-size: 36px;
    font-weight: normal;
  }

  h2 {
    font-size: 28px;
    font-weight: normal;
  }

  label {
    color: #666;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="file"],
  textarea {
    border-radius: 2px;
    border: 1px solid #ddd;
    padding: 4px 6px;
    width: 100%;
  }

  textarea {
    height: 80px;
  }

  form table {
    border-spacing: 0 10px;
    width: 100%;
  }

  a {
    color: #0077cc;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  a:focus,
  a:active:focus,
  a.active:focus,
  a.focus,
  a:active.focus,
  a.active.focus {
    outline: 1px dotted;
  }

  button {
    border: none;
    background-color: inherit;
  }

  button:focus,
  button:active:focus,
  button.active:focus,
  button.focus,
  button:active.focus,
  button.active.focus {
    outline: none !important;
  }

  a,
  input[type="submit"],
  input[type="reset"],
  input[type="button"],
  input[type="text"],
  input[type="password"]
  button,
  textarea {
    -webkit-app-region: no-drag;
  }

  .delete-link {
    color: red;
  }

  /* Styles for ModalDialogs, copied from the demos at https://hjkcai.github.io/vue-modal-dialogs/ */
  .dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, .4);
    z-index: 999;
  }

  .dialog-content {
    width: 480px;
    margin: 0 20px;
    padding: 25px 30px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    color: #222;
  }

  .dialog-content header {
    margin: 10px 0 15px;
  }

  .dialog-content header h2 {
    margin: 0;
  }

  .dialog-content footer {
    margin-top: 20px;
  }

  .dialog-content p {
    white-space: pre-wrap;
  }

  .dialog-content label {
    margin-right: 20px;
  }

  .dialog-content input {
    padding: 6px;
  }

  .dialog-content button {
    border: 0;
    border-radius: 4px;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 10px 15px;
    min-width: 85px;
  }

  .dialog-content button.confirm {
    color: white;
    background-color: #338fff;
  }

  .dialog-content button.confirm:hover,
  .dialog-content button.confirm:focus {
    background-color: #0073ff;
  }

  .dialog-content button.cancel {
    color: white;
    background-color: #999;
  }

  .dialog-content button.cancel:hover,
  .dialog-content button.cancel:focus {
    background-color: #7f7f7f;
  }

  .message-box .dialog-content {
    text-align: center;
    font-size: 16px;
  }

  .message-box footer {
    text-align: center;
  }

  .message-box footer button {
    margin: 0 7.5px;
  }

  .message-box input {
    margin: 10px 0;
  }

  .edit-dialog .dialog-content {
    text-align: left;
    font-size: 16px;
  }

  .edit-dialog footer {
    text-align: right;
  }

  .edit-dialog footer button {
    margin-left: 15px;
  }

  .dialog-fade-enter-active {
    animation: dialog-fade-in .3s;
  }

  .dialog-fade-leave-active {
    animation: dialog-fade-out .3s;
  }
  
  @keyframes dialog-fade-in {
    0% {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
      opacity: 0;
    }
    to {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes dialog-fade-out {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
    to {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
      opacity: 0;
    }
  }
</style>
