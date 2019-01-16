<template>
  <div class="intro-wrapper">
    <div class="intro-inner-wrapper">
      <p>Welcome to the site builder. You don't have any sites yet but you can create one by pressing the button below.</p>
      <button @click="startCreatingSite">Create a site</button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    methods: {
      ...mapActions([
        'startCreatingSite'
      ])
    }
  }
</script>

<style scoped>

  .intro-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .intro-inner-wrapper {
    max-width: 400px;
    text-align: center;
  }

  button {
    background-color: lightgreen;
    border-radius: 4px;
    font-size: 32px;
    padding: 20px 40px;
    cursor: pointer;
  }

  button:hover {
    background-color: darkgreen;
  }

</style>
