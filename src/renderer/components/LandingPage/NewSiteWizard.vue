<template>
  <div class="wizard-wrapper">
    <div class="wizard-step">
      <h2>Site Name</h2>
      <p class="wizard-info">The name of this site - it's just used for saving and loading files and won't be displayed anywhere online.</p>
      <div class="wizard-input">
        <input type="text" v-model="name"/>
      </div>
    </div>
    <div class="wizard-step">
      <h2>Title</h2>
      <p class="wizard-info">The title of this site to be displayed in the browser's title bar and main heading.</p>
      <div class="wizard-input">
        <input type="text" v-model="title"/>
      </div>
    </div>
    <div class="wizard-step">
      <h2>Introduction</h2>
      <p class="wizard-info">Some introductory text about who you are and what you do. It will be displayed under the heading on the main page.</p>
      <div class="wizard-input">
        <textarea v-model="intro"/>
      </div>
    </div>
    <div class="wizard-step">
      <h2>Logo</h2>
      <p class="wizard-info">The logo of your business, organisation or product to be displayed in the header. It should be a PNG file, at least ? px tall.</p>
      <div class="wizard-input">
        <input type="file"/>
      </div>
    </div>
    <div class="wizard-step">
      <h2>Icon</h2>
      <p class="wizard-info">An icon to be displayed in the browser's title bar. It should be a PNG file, at least ? px square.</p>
      <div class="wizard-input">
        <input type="file"/>
      </div>
    </div>
    <div class="wizard-step">
      <h2>Banner Image (optional)</h2>
      <p class="wizard-info">A large banner to be displayed along the top of the site's main page. It should be a JPG file, at least ? px wide.</p>
      <div class="wizard-input">
        <input type="file"/>
      </div>
    </div>
    <button @click="createSite">Create site</button>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { mapFields } from 'vuex-map-fields'

  export default {
    computed: {
      ...mapFields([
        'info.name',
        'info.title',
        'info.intro'
        // ...
      ])
    },
    methods: {
      ...mapActions([
        'createSite'
      ])
    }
  }
</script>

<style scoped>
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

  button {
    background-color: lightgreen;
    border-radius: 4px;
    font-size: 32px;
    padding: 20px 40px;
    cursor: pointer;
    width: 100%;
  }

  button:hover {
    background-color: darkgreen;
  }

</style>
