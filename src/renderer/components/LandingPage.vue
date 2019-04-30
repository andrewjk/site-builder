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
        <intro v-if="!sitesExist && !creatingSite"></intro>
        <new-site-wizard v-else-if="creatingSite"></new-site-wizard>
        <data-editor v-else-if="activeSection.type === 'data'" :definition="siteInfoDefinition" :data="siteInfo"></data-editor>
        <collection-editor v-else-if="activeSection.type === 'collection'"></collection-editor>
        <page-editor v-else-if="activeSection.type === 'page'"></page-editor>
      </div>
    </main>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

  import SiteHeader from './LandingPage/SiteHeader'
  import SideBar from './LandingPage/SideBar'
  import Intro from './LandingPage/Intro'
  import NewSiteWizard from './LandingPage/NewSiteWizard'
  import DataEditor from './LandingPage/DataEditor'
  import CollectionEditor from './LandingPage/CollectionEditor'
  import PageEditor from './LandingPage/PageEditor'

  export default {
    name: 'landing-page',
    components: { SiteHeader, SideBar, Intro, NewSiteWizard, DataEditor, CollectionEditor, PageEditor },
    computed: {
      ...mapState({
        sitesExist: state => state.State.sitesExist,
        creatingSite: state => state.State.creatingSite,
        siteInfoDefinition: state => state.State.infoDefinition,
        siteInfo: state => state.State.info
      }),
      ...mapGetters([
        'activeSection'
      ])
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
    display: grid !important;
    grid-template-columns: auto 1fr;
  }

</style>
