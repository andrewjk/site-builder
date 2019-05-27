<template>
  <div class="message-box dialog-mask">
    <div class="dialog-content" @click.stop="doNothing" @keyup.enter="$close(true)" @keyup.esc="$close(false)">
      <div class="dialog-body">
        <p>{{ content }}</p>
      </div>
      <footer>
        <button id="dialog-confirm" class="confirm" @click="$close(true)">{{ this.confirmText ? this.confirmText : 'OK' }}</button>
        <button class="cancel" @click="$close(false)">{{ this.cancelText ? this.cancelText : 'Cancel' }}</button>
      </footer>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      content: '',
      confirmText: '',
      cancelText: ''
    },
    mounted () {
      // HACK: The autofocus attribute doesn't seem to work all the time?
      document.getElementById('dialog-confirm').focus()
    },
    methods: {
      doNothing () {
        // HACK: This just prevents clicks on the dialog-content bubbling to the dialog-mask. There's probably a better way to do this...
      }
    }
  }
</script>
