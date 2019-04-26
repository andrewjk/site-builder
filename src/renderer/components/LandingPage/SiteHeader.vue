<template>
  <div class="header-wrapper">
    <h1>{{ title }}</h1>
    <select v-show="sitesExist" v-model="activeSite" @change="loadOrCreateSite(activeSite)">
      <option v-for="item in sites" :key="item">{{ item }}</option>
      <option value="~Create~">Create a Site</option>
    </select>
    <button type="button" @click="buildSiteInStore">Build</button>
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
        'sitesExist',
        'sites',
        'activeSite'
        // ...
      ])
    },
    methods: {
      ...mapActions([
        'loadSite',
        'startCreatingSite',
        'buildSite'
      ]),
      loadOrCreateSite (data) {
        // HACK: Tildes ensure that it's not something that a user can create
        if (this.activeSite === '~Create~') {
          this.startCreatingSite()
        } else {
          this.loadSite(this.activeSite)
        }
      },
      async buildSiteInStore () {
        this.buildSite(this.activeSite)
      }
    }
  }
</script>

<style scoped>

  .header-wrapper {
    background-color: #2d2d2d;
    color: #eee;
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-column-gap: 10px;
    padding: 20px 10px;
  }

  h1 {
    margin: 0;
  }

  button {
    background-color: white;
    border-radius: 2px;
    padding: 0 10px;
  }

  button:hover,
  button:focus {
    background-color: #ccc;
  }

  select {
    border: none;
    border-radius: 2px;
    padding: 0 5px;
  }

</style>
