<template>
  <div>
    <a-button class="white-border-ant-button" type="primary" size="small" @click="panToHome">
      <i class="fa-solid fa-house"></i>
    </a-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from '../../stores/map-state.js';
export default defineComponent({
  setup() {
    return {};
  },
  data() {
    return {};
  },
  computed: {
    map() {
      return mapState().getMap;
    },
  },
  methods: {
    panToHome() {
      this.map.getView().animate({
        // Quảng Nam
        center: [108.167, 15.628],
        zoom: 10,
        duration: 1000,
      });
    },
  },
  mounted() {},
});
</script>

<style lang="scss"></style>
