<template>
  <a-row class="h-100" justify="space-around" align="middle">
    <p class="text-white">Công cụ:</p>
    <PanToHome></PanToHome>
    <ZoomTool></ZoomTool>
    <!-- <a-button class="white-border-ant-button" type="primary" size="small" @click="test">
      <i class="fa-solid fa-hand"></i>
    </a-button> -->
    <MeasureTool></MeasureTool>
    <FeatureInfoPopup></FeatureInfoPopup>
    <MapPrinter></MapPrinter>
    <!-- <a-button class="white-border-ant-button" type="primary" size="small">
      <i class="fa-solid fa-pencil"></i>
    </a-button> -->
  </a-row>
</template>

<script>
import { defineComponent } from 'vue';
import PanToHome from './pan-to-home.vue';
import ZoomTool from './zoom-tool.vue';
import MeasureTool from './measure-tool.vue';
import FeatureInfoPopup from './feature-info-popup.vue';
import MapPrinter from './map-printer.vue';

export default defineComponent({
  components: {
    PanToHome,
    ZoomTool,
    MeasureTool,
    FeatureInfoPopup,
    MapPrinter,
  },
  setup() {
    return {};
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    test() {
      // console.log(this.mapContainerElement);
      // console.log(document.getElementById('map-container'));
    },
  },
  mounted() {
    // console.log(document.getElementById('map-container'));
    // console.log(this.$refs.mapContainerElement);
  },
});
</script>

<style lang="scss">
.ol-tool-control-panel {
  position: absolute;
  top: 20px;
  left: 30px;
  // background-color: red;
  width: auto;
  height: auto;
}
</style>
