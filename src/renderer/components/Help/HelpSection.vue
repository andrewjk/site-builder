
<template>
  <div class="help-container">
    <settings-help v-if="section === 'Settings'"/>
    <data-help v-if="section === 'Data'"/>
    <pages-help v-if="section === 'Pages'"/>
    <blocks-help v-if="section === 'Blocks'"/>
  </div>
</template>

<script>
  import SettingsHelp from './SettingsHelp'
  import DataHelp from './DataHelp'
  import PagesHelp from './PagesHelp'
  import BlocksHelp from './BlocksHelp'

  export default {
    components: { SettingsHelp, DataHelp, PagesHelp, BlocksHelp },
    props: {
      section: ''
    }
  }
</script>

<style scoped>
  .help-container {
    padding: 20px;
  }
</style>
