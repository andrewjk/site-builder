<template>
  <div class="header-wrapper">
    <h1>{{ title }}</h1>
    <select v-show="sitesExist" v-model="activeSite" @change="loadOrCreateSite(activeSite)">
      <option v-for="item in sites" :key="item">{{ item }}</option>
      <option value="~Create~">Create a Site</option>
    </select>
    <button type="button" @click="saveSiteInStore">Save</button>
    <button type="button" @click="buildSiteInStore">Build</button>
  </div>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  import { mapFields } from 'vuex-map-fields'

  export default {
    computed: {
      ...mapFields([
        'info.name',
        'info.title',
        'sitesExist',
        'sites',
        'activeSite'
      ])
    },
    methods: {
      ...mapMutations([
        'START_CREATING_SITE',
        'STOP_CREATING_SITE'
      ]),
      ...mapActions([
        'loadSite',
        'saveSite',
        'buildSite'
      ]),
      loadOrCreateSite (data) {
        // HACK: Tildes ensure that it's not something that a user can create
        if (this.activeSite === '~Create~') {
          this.START_CREATING_SITE()
        } else {
          this.STOP_CREATING_SITE()
          this.loadSite(this.activeSite)
        }
      },
      async saveSiteInStore () {
        this.saveSite(this.activeSite)
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
    padding: 20px 10px;
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    grid-column-gap: 10px;
    align-items: center;
  }

  h1 {
    margin: 0;
  }

  button {
    background-color: white;
    border-radius: 2px;
    padding: 6px 10px;
  }

  button:hover,
  button:focus {
    background-color: #ccc;
  }

  select {
    border: 0;
    border-radius: 2px;
    padding: 5px 5px;
  }

</style>
