<template>
  <div class="edit-dialog dialog-mask">
    <div class="dialog-content" @click.stop="doNothing">
      <div class="dialog-body">
        <p>{{ content }}</p>
        <div class="buttons-container">
          <button v-for="block in blocks" :key="block.file" @click="$close(block)">{{ block.name }}</button>
        </div>
      </div>
      <footer>
        <button class="cancel" @click="$close('')">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      content: ''
    },
    computed: {
      ...mapGetters([
        'blocks'
      ])
    },
    mounted () {
      // HACK: The autofocus attribute doesn't seem to work all the time?
    },
    methods: {
      doNothing () {
        // HACK: This just prevents clicks on the dialog-content bubbling to the dialog-mask. There's probably a better way to do this...
      }
    }
  }
</script>

<style lang="scss" scoped>
  .buttons-container {
    button {
      background-color: #4d90fe;
      border: 1px solid transparent;
      border-radius: 2px;
      color: white;
      margin: 2px;
      padding: 10px;
      width: 100%;
    }
    button:hover {
      background-color: darken(#4d90fe, 9%);
    }
    button:focus {
      background-color: darken(#4d90fe, 9%);
    }
  }
</style>
