<template>
  <div class="message-box dialog-mask">
    <div class="dialog-content" @click.stop="doNothing">
      <div class="dialog-body">
        <p>{{ content }}</p>
        <input id="dialog-input" :type="type ? type : 'text'" v-model="result" @keyup.enter="$close(result)" @keyup.esc="$close('')">
      </div>
      <footer>
        <button class="confirm" @click="$close(result)">OK</button>
        <button class="cancel" @click="$close('')">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      content: '',
      type: ''
    },
    data () {
      return {
        result: ''
      }
    },
    mounted () {
      // HACK: The autofocus attribute doesn't seem to work all the time?
      document.getElementById('dialog-input').focus()
    },
    methods: {
      doNothing () {
        // HACK: This just prevents clicks on the dialog-content bubbling to the dialog-mask. There's probably a better way to do this...
      }
    }
  }
</script>
