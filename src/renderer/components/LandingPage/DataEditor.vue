<template>
  <div class="data-editor-wrapper">
    <div class="title">{{ definition.title }}</div>
    <table>
      <tbody>
        <tr v-for="def in definition.definitions" :key="def.key">
          <td>
            <label :for="def.key">{{ def.name }}</label>
          </td>
          <td>
            <input type="text" :id="def.key" v-model="def.value">
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    props: {
      definition: {},
      data: {}
    }
  }
</script>

<style scoped>
  .data-editor-wrapper {
    padding: 20px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  label {
    margin-right: 20px;
  }
</style>
