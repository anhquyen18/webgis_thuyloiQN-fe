<template>
  <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
    <template #title>
      <p>Phóng to</p>
    </template>
    <a-button class="white-border-ant-button" type="primary" :size="buttonSize" @click="zoomIn">
      <i class="fa-solid fa-magnifying-glass-plus"></i>
    </a-button>
  </a-tooltip>
  <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
    <template #title>
      <p>Thu nhỏ</p>
    </template>
    <a-button class="white-border-ant-button" type="primary" :size="buttonSize" @click="zoomOut">
      <i class="fa-solid fa-magnifying-glass-minus"></i>
    </a-button>
  </a-tooltip>
</template>

<script>
import { defineComponent, inject, ref } from 'vue';
import { mapState } from '../../stores/map-state.js';
export default defineComponent({
  setup() {
    const buttonSize = inject('buttonSize');
    return {
      buttonSize,
    };
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
    zoomIn() {
      //   console.log(this.map.getView().getZoom());
      //   this.map.getView().setZoom(this.map.getView().getZoom() + 1);
      this.map.getView().animate({
        center: this.map.getView().getCenter(),
        zoom: this.map.getView().getZoom() + 1,
        duration: 200,
      });
    },
    zoomOut() {
      this.map.getView().animate({
        center: this.map.getView().getCenter(),
        zoom: this.map.getView().getZoom() - 1,
        duration: 200,
      });
    },
  },
  mounted() {},
});
</script>

<style lang="scss"></style>
