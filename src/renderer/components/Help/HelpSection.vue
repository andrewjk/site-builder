
<template>
  <div class="help-container">
    <settings-help v-if="section === 'Settings'"></settings-help>
  </div>
</template>

<script>
  import SettingsHelp from './SettingsHelp'

  export default {
    components: { SettingsHelp },
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
