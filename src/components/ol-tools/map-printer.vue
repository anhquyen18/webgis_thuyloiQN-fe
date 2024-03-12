<template>
  <a-tooltip overlayClassName="tool-container-tooltip">
    <template #title>
      <p>In bản đồ</p>
    </template>
    <a-button class="white-border-ant-button" type="primary" :size="buttonSize" @click="openPrintModal">
      <i class="fa-solid fa-print"></i>
    </a-button>
    <a-modal v-model:open="printOpen" :footer="null" style="width: 98vw; top: 2vh">
      <a-layout style="width: 100%; height: 94vh">
        <a-layout-sider theme="light">
          <a-button @click="testClick"> Test </a-button>
        </a-layout-sider>
        <a-layout>
          <a-layout-content>
            <div id="print-map" style="width: 100%; height: 100%; background-color: cyan"></div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-modal>
  </a-tooltip>
</template>

<script>
import { defineComponent, inject, ref } from 'vue';
import { mapState } from '../../stores/map-state';
import * as VueLayer from '@/js/openlayers/VueLayer.js';

export default defineComponent({
  setup() {
    const buttonSize = inject('buttonSize');
    // buttonSize.value = 'large';
    return {
      buttonSize,
    };
  },

  data() {
    return {
      printOpen: false,
    };
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  methods: {
    openPrintModal() {
      const printer = VueLayer.getControlByTitle(this.map, 'Print control');
      printer.print();
      // this.map.getControls().getArray()[7].print();
      // console.log(document.getElementsByClassName('ol-closebox'));
      // console.log(document.getElementsByClassName('ol-closebox'));
      // this.printOpen = true;
      // console.log(this.map.removeControl(this.map.getControls().getArray()[5]));
    },
    testClick() {
      // var printControl = new ol_control_PrintDialog({
      //   target: document.querySelector('#print-button'),
      //   targetDialog: map.getTargetElement()
      //   // save: false,
      //   // copy: false,
      //   // pdf: false
      // });
      // printControl.setSize('A4');
      // map.addControl(printControl);
      // console.log(this.map);
      // this.map.setTarget('print-map');
      // var size = this.map.getSize();
      // var canvas = document.createElement('canvas');
      // canvas.width = size[0];
      // canvas.height = size[1];
      // var context = canvas.getContext('2d');
      // this.map.renderSync(context);
      // var win = window.open('', 'Print Map');
      // win.document.write('<html><head><title>Bản đồ</title></head><body>');
      // win.document.write(canvas.outerHTML);
      // win.document.write('</body></html>');
      // win.print();
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
