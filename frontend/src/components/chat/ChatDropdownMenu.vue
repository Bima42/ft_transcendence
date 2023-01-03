<template>
  <dropdown class="my-dropdown-toggle"
            :options="chatList"
            :selected="name"
            v-on:updateOption="methodToRunOnSelect"
            :placeholder="name"
            :closeOnOutsideClick="true">
  </dropdown>
</template>
<script>
export default {
  components: {
    'dropdown': dropdown,
  },
  methods: {
    methodToRunOnSelect(payload) {
      this.object = payload;
    }
  },
  props: {
    chatList: Object,
    name: String,
  },
  data() {
    return {
      object: {
        name: 'Object Name',
      }
    }
  },
}
</script>

<script setup>
import dropdown from 'vue-dropdowns'
</script>

<style scoped>
.my-dropdown-toggle {
  border-radius: 5px;

::v-deep .dropdown-toggle {
  color: tomato;
  font-size: 25px;
  font-weight: 800;
}

::v-deep .dropdown-toggle-placeholder {
  color: #c4c4c4;
}
}
</style>