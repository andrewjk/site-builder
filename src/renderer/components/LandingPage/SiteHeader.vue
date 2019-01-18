<template>
  <div class="header-wrapper">
    <h1>{{ title }}</h1>
    <select v-show="sitesExist" v-model="activeSite" @change="loadOrCreateSite(activeSite)">
      <option v-for="item in sites" :key="item">{{ item }}</option>
      <option value="~Create~">Create a Site</option>
    </select>
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
        'startCreatingSite'
      ]),
      loadOrCreateSite (data) {
        // HACK: Tildes ensure that it's not something that a user can create
        if (this.activeSite === '~Create~') {
          this.startCreatingSite()
        } else {
          this.loadSite(this.activeSite)
        }
      }
    }
  }
</script>

<style scoped>

  .header-wrapper {
    background-color: #2d2d2d;
    color: #eee;
    display: flex;
    padding: 20px 10px;
  }

  h1 {
    flex: 1 1 auto;
    margin: 0;
  }

  select {
    flex: 0 0 auto;
  }

</style>
