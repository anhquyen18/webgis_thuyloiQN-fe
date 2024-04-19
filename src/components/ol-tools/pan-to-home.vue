<template>
  <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
    <template #title>
      <p>Trở về</p>
    </template>
    <a-button class="white-border-ant-button" type="primary" :size="buttonSize" @click="panToHome">
      <i class="fa-solid fa-house"></i>
    </a-button>
  </a-tooltip>
</template>

<script>
import { defineComponent, inject, ref } from 'vue';
import { mapState } from '../../stores/map-state.js';
export default defineComponent({
  setup() {
    const buttonSize = inject('buttonSize');
    const tooltipBackground = inject('tooltipBackground');

    return {
      buttonSize,
      tooltipBackground,
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
    panToHome() {
      this.map.getView().animate({
        // Quảng Nam
        center: [580872.2309828001, 1724335.9856269273],
        zoom: 10,
        duration: 1000,
      });
    },
  },
  mounted() {},
});
</script>

<style lang="scss">
.tool-container-tooltip {
  & .ant-tooltip-content .ant-tooltip-inner {
    min-height: auto !important;
    padding: 5px;
  }
}
</style>
