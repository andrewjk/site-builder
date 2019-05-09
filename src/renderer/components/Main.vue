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

        <help-section v-else-if="activeSection && activeSection.type === 'title'" :section="activeSection.text"></help-section>

        <data-editor v-else-if="activeSection && activeSection.type === 'data'" :definition="activeSection.definition" :data="activeSection.data"></data-editor>
        <collection-editor v-else-if="activeSection && activeSection.type === 'collection'" :definition="activeSection.definition" :data="activeSection.data"></collection-editor>
        <page-editor v-else-if="activeSection && activeSection.type === 'page'" :page="activeSection.page" :definition="activeSection.definition" :data="activeSection.data"></page-editor>
        <block-editor v-else-if="activeSection && activeSection.type === 'block'" :block="activeSection.block" :definition="activeSection.definition" :data="activeSection.data"></block-editor>
      </div>
    </main>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

  import SiteHeader from './Components/SiteHeader'
  import SideBar from './Components/SideBar'
  import Intro from './Components/Intro'
  import NewSiteWizard from './Components/NewSiteWizard'

  import HelpSection from './Help/HelpSection'

  import DataEditor from './Components/DataEditor'
  import CollectionEditor from './Components/CollectionEditor'
  import PageEditor from './Components/PageEditor'
  import BlockEditor from './Components/BlockEditor'

  export default {
    name: 'landing-page',
    components: { SiteHeader, SideBar, Intro, NewSiteWizard, HelpSection, DataEditor, CollectionEditor, PageEditor, BlockEditor },
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

  .editor-container {
    padding: 20px;
  }

</style>
