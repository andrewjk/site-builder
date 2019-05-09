<template>
  <div class="data-editor-wrapper">
    <table>
      <tbody>
        <tr v-for="def in definition.definitions" :key="def.key">
          <td>
            <label :for="def.key">{{ def.name }}</label>
          </td>
          <td>
            <input type="text" :id="def.key" :value="data[def.key]" @input="$emit('change', def.key, $event.target.value)">
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
      data: {},
      file: ''
    }
  }
</script>

<style lang="scss" scoped>
  label {
    margin-right: 20px;
  }
</style>
