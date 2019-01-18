<template>
  <div class="body-wrapper">
    <header>
      <site-header></site-header>
    </header>
    <main>
      <div class="side-bar-container" v-show="sitesExist && !creatingSite">
        <side-bar></side-bar>
      </div>

      <div class="editor-container">
        <intro v-show="!sitesExist && !creatingSite"></intro>
        <new-site-wizard v-show="creatingSite"></new-site-wizard>
      </div>
    </main>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'

  import SiteHeader from './LandingPage/SiteHeader'
  import SideBar from './LandingPage/SideBar'
  import Intro from './LandingPage/Intro'
  import NewSiteWizard from './LandingPage/NewSiteWizard'
  import CollectionEditor from './LandingPage/CollectionEditor'
  import DataEditor from './LandingPage/DataEditor'

  export default {
    name: 'landing-page',
    components: { SiteHeader, SideBar, Intro, NewSiteWizard, CollectionEditor, DataEditor },
    computed: {
      ...mapState({
        sitesExist: state => state.State.sitesExist,
        creatingSite: state => state.State.creatingSite
      })
    },
    methods: {
      ...mapMutations([
      ]),
      ...mapActions([
        'loadAllSites'
      ])
    },
    mounted () {
      this.loadAllSites()
    }
  }
</script>

<style>

  main {
    display: flex;
  }

  .side-bar-container {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
  }

  .editor-container {
    flex: 1 1 auto;
  }

</style>
