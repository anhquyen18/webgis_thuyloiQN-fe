<template>
  <a-popover
    :align="{
      points: ['tl', 'tl'],
      offset: [0, 0], // the offset sourceNode by 10px in x and 20px in y,
    }"
    v-model:open="open"
    trigger=""
    color="transparent">
    <template #content>
      <div style="position: relative; width: auto; text-wrap: wrap; word-wrap: break-word">
        <a class="close-button" @click="closeLegend" style="position: absolute; top: 0px; right: 0px">
          <i class="fa-solid fa-xmark"></i>
        </a>
        <p class="fw-bold">Chú thích</p>
        <a-row :gutter="[4, 0]" justify="center" align="middle">
          <a-col :span="12">
            <p class="small-p">Hồ chứa</p>
          </a-col>
          <a-col :span="12">
            <img src="../../assets/legend-image/ho-chua.png" width="50" height="30" />
          </a-col>
        </a-row>
      </div>
    </template>
    <a-button
      id="legend-button"
      type="default"
      class="legend-button no-border-ant-button"
      :class="{ 'legend-button__hidden': open }"
      @click="showLegend"
      ghost>
      <i class="fa-solid fa-table-list fs-5"></i>
      <!-- <i class="fa-solid fa-receipt"></i> -->
    </a-button>
  </a-popover>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from '../../stores/map-state';
import * as VueLayer from '../../js/openlayers/VueLayer.js';

export default defineComponent({
  setup() {
    return {};
  },

  data() {
    return {
      open: false,
    };
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  methods: {
    showLegend() {
      this.open = true;
      // this.$refs.legendButton.classList.add('legend-button__hidden');
      // console.log(this.$el.querySelector('.legend-button'));
    },
    closeLegend() {
      this.open = false;

      // document.getElementsByClassName('.legend-button').classList
    },
  },

  mounted() {},
});
</script>

<style lang="scss">
.legend-button {
  position: absolute;
  bottom: 2vh;
  left: 1vw;
  padding: 0;
  line-height: normal;
  height: auto;
}

.legend-button__hidden {
  color: transparent !important;
}

.small-p {
  font-size: 0.8rem;
}
</style>
