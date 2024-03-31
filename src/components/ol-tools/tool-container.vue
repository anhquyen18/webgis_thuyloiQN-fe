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
    <GeolocationTool></GeolocationTool>
    <!-- <FeatureModifyTool></FeatureModifyTool> -->
    <FeatureModifyTool v-show="loginState"></FeatureModifyTool>
    <!-- <a-button class="white-border-ant-button" type="primary" size="small">
      <i class="fa-solid fa-pencil"></i>
    </a-button> -->
  </a-row>
</template>

<script>
import { defineComponent, provide, ref, inject } from 'vue';
import { userState } from '@/stores/user-state';

import PanToHome from './pan-to-home.vue';
import ZoomTool from './zoom-tool.vue';
import MeasureTool from './measure-tool.vue';
import FeatureInfoPopup from './feature-info-popup.vue';
import MapPrinter from './map-printer.vue';
import GeolocationTool from './geolocation-tool.vue';
import FeatureModifyTool from './feature-modify-tool.vue';

export default defineComponent({
  components: {
    PanToHome,
    ZoomTool,
    MeasureTool,
    FeatureInfoPopup,
    MapPrinter,
    GeolocationTool,
    FeatureModifyTool,
  },
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
    loginState() {
      return userState().getLogin;
    },
  },
  methods: {
    test() {
      // console.log(this.mapContainerElement);
      // console.log(document.getElementById('map-container'));
    },
  },
  mounted() {
    // console.log(window.innerWidth);
    // if (window.innerWidth > 1600) this.buttonSize = 'medium';
    // // console.log(window.screen.width);
    // window.addEventListener('resize', function (event) {
    //   if (window.innerWidth > 1600) {
    //     console.log(this.buttonSize);
    //     this.buttonSize = 'medium';
    //   } else this.buttonSize = 'small';
    // });
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
