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

        <settings-editor v-else-if="activeSection && activeSection.type === 'settings'" :name="activeSection.name" :definition="activeSection.definition" :data="activeSection.data" @save="saveSettings(activeSection)" @cancel="cancelSettings(activeSection)"/>
        <collection-editor v-else-if="activeSection && activeSection.type === 'collection'" :name="activeSection.text" :data="activeSection.data" @save="saveData(activeSection)" @cancel="cancelData(activeSection)"/>
        <page-editor v-else-if="activeSection && activeSection.type === 'page'" :page="activeSection.page" :definition="activeSection.definition" :data="activeSection.data" @save="savePage(activeSection)" @cancel="cancelPage(activeSection)"/>
        <block-editor v-else-if="activeSection && activeSection.type === 'block'" :block="activeSection.block" :definition="activeSection.definition" :data="activeSection.data" @save="saveBlock(activeSection)" @cancel="cancelBlock(activeSection)"/>
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

  import SettingsEditor from './Components/SettingsEditor'
  import CollectionEditor from './Components/CollectionEditor'
  import PageEditor from './Components/PageEditor'
  import BlockEditor from './Components/BlockEditor'

  export default {
    name: 'landing-page',
    components: { SiteHeader, SideBar, Intro, NewSiteWizard, HelpSection, SettingsEditor, CollectionEditor, PageEditor, BlockEditor },
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
      ]),
      saveSettings (section) {
        alert('save: ' + section.text)
      },
      cancelSettings (section) {
        alert('cancel: ' + section.text)
      },
      saveData (section) {
        alert('save: ' + section.text)
      },
      cancelData (section) {
        alert('cancel: ' + section.text)
      },
      savePage (section) {
        alert('save: ' + section.text)
      },
      cancelPage (section) {
        alert('cancel: ' + section.text)
      },
      saveBlock (section) {
        alert('save: ' + section.text)
      },
      cancelBlock (section) {
        alert('cancel: ' + section.text)
      }
    },
    mounted () {
      this.loadAllSites()
    }
  }
</script>

<style>

  .body-wrapper {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100vh;
  }

  main {
    display: grid !important;
    grid-template-columns: auto 1fr;
  }

  .editor-container {
    padding: 20px;
  }

</style>
