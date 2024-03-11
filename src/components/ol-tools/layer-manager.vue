<template>
  <a-popover trigger="click" placement="topRight" :arrowPointAtCenter="true">
    <template #content>
      <div class="layer-image-container" style="max-width: 70vw">
        <a-row align="middle" justify="space-around">
          <a-col>
            <p>Tỉ lệ</p>
          </a-col>
          <a-col :span="12">
            <a-select
              v-model:value="scaleValue"
              min
              :options="scaleOptions"
              style="width: 100%"
              @select="scaleChange"></a-select>
          </a-col>
        </a-row>
        <a-divider style="border-color: black; font-size: 0.8rem" orientation="left">
          <a-row style="width: 150px" justify="center" align="middle">
            <a-col :span="6"> Layers </a-col>
            <a-col :span="17" :offset="1">
              <a-slider v-model:value="mainLayerOpacity" :tooltipOpen="false" @change="mainLayerOpacityChange" />
            </a-col>
          </a-row>

          <!-- <a-button @click="showLayersInfoModal" style="border: none; padding: 0; font-size: 0.8rem">
            <InfoCircleOutlined />
          </a-button> -->
        </a-divider>
        <a-row class="main-layer" :gutter="[0, 8]">
          <a-col :xl="4" :xs="6" v-for="(layer, index) in mainLayerData">
            <a-tooltip overlayClassName="tool-container-tooltip">
              <template #title> {{ layer.displayName }}</template>
              <div class="layer-image">
                <a-button
                  @click="changeLayerVisible(layer.title, index)"
                  type="primary"
                  shape="circle"
                  block
                  class="h-100"
                  :style="{ margin: 0, padding: 0 }">
                  <img
                    :src="layer.imagePath"
                    alt=""
                    width="57"
                    height="57"
                    :class="{ 'layer-image__image--active': layer.visible }"
                    class="layer-image__image position-absolute rounded-circle" />
                </a-button>
              </div>
            </a-tooltip>
          </a-col>
        </a-row>
        <a-divider style="border-color: black" orientation="left"> Basemaps</a-divider>
        <a-row class="basemap-layer" :gutter="[0, 8]">
          <a-col :xl="4" :xs="6" v-for="layer in basemapLayerData">
            <a-tooltip overlayClassName="tool-container-tooltip">
              <template #title>{{ layer.title }}</template>
              <div class="layer-image">
                <a-button
                  @click="changeBaseMap(layer.imagePath, layer.title)"
                  type="primary"
                  shape="circle"
                  block
                  class="h-100">
                  <img
                    :src="layer.imagePath"
                    alt=""
                    width="57"
                    height="57"
                    class="layer-image__image position-absolute rounded-circle" />
                </a-button>
              </div>
            </a-tooltip>
          </a-col>
        </a-row>
      </div>
    </template>
    <div class="layer-image">
      <a-button type="primary" shape="circle" block class="h-100">
        <img
          :src="layerManagerImage"
          alt=""
          width="57"
          height="57"
          class="layer-image__image position-absolute rounded-circle" />
      </a-button>
    </div>
  </a-popover>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, inject } from 'vue';

// import { userState } from '../stores/user-state';
import { mapState } from '../../stores/map-state';
import * as VueLayer from '../../js/openlayers/VueLayer.js';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { getPointResolution } from 'ol/proj.js';
export default defineComponent({
  components: {
    InfoCircleOutlined,
  },
  setup() {
    const basemapLayerData = [
      {
        title: 'Open Street Map',
        imagePath: new URL('/src/assets/layer-image/Openstreetmap_logo.png', import.meta.url),
      },
      {
        title: 'Google Map',
        imagePath: new URL('/src/assets/layer-image/googlemap.jpg', import.meta.url),
      },
      // {
      //   title: 'Water Color',
      //   imagePath: '/src/assets/layer-image/watercolor.png',
      // },
      {
        title: 'Toner',
        imagePath: new URL('/src/assets/layer-image/toner.png', import.meta.url),
      },
      {
        title: 'Topo Map',
        imagePath: new URL('/src/assets/layer-image/topo.jpg', import.meta.url),
      },
      {
        title: 'Streets Map',
        imagePath: new URL('/src/assets/layer-image/streets.png', import.meta.url),
      },
      {
        title: 'No Basemap',
        imagePath: new URL('/src/assets/layer-image/nobasemap.png', import.meta.url),
      },
    ];

    // const mainLayerData = ref([
    //   {
    //     title: 'Cống ngầm',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Kênh',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Cống ngăn triều',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Hố ga',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Cửa xả',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Hồ điều hoà',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Trạm đo mưa',
    //     imagePath: '',
    //     visible: true,
    //   },
    // ]);

    const mainLayerData = inject('mainLayerData');

    // default basemap
    var layerManagerImage = ref(basemapLayerData[4].imagePath);
    const layersInfoOpen = ref(false);
    const scaleValue = ref(10000);
    const scaleOptions = ref([
      {
        value: 10000,
        label: '1 : 10000',
      },
      {
        value: 100000,
        label: '1 : 100000',
      },
      {
        value: 500000,
        label: '1 : 500000',
      },
      {
        value: 1000000,
        label: '1 : 1000000',
      },
      {
        value: 2000000,
        label: '1 : 2000000',
      },
    ]);
    const test = ref(false);

    return {
      basemapLayerData,
      layerManagerImage,
      mainLayerData,
      layersInfoOpen,
      scaleOptions,
      scaleValue,
      test,
    };
  },

  computed: {
    getSignInState: function () {
      return userState().getSignInState;
    },
    map() {
      return mapState().getMap;
    },
  },

  data() {
    return {
      // Các hằng số dựa trên source của openlayers ScaleLine.js
      inchesPerMeter: 1000 / 25.4,
      DEFAULT_DPI: 25.4 / 0.28,
      mainLayerOpacity: 100,
      // signInState: true,
      // test: '123',
      // anhquyen: '321123',
      // map: new ol.Map({}),
    };
  },

  mounted() {
    // console.log(this.map);
  },

  methods: {
    changeBaseMap(image, title) {
      this.layerManagerImage = image;
      // const baseLayerGroup = this.map.getLayers().getArray()[0];
      const baseLayers = this.map.getLayers().getArray()[0].getLayers().getArray();
      baseLayers.forEach((element) => {
        element.setVisible(false);
        if (element.get('title') == title) {
          element.setVisible(true);
        }
      });
    },
    changeLayerVisible(layerName, index) {
      var layer = VueLayer.getLayerByTitle(this.map, layerName, 1);
      if (layer.getVisible()) {
        this.mainLayerData[index].visible = false;
        layer.setVisible(false);
        // event.currentTarget.getElementsByTagName('img')[0].classList.remove('layer-image__image--active');
        // this.test = false;
      } else if (!layer.getVisible()) {
        layer.setVisible(true);
        this.mainLayerData[index].visible = true;

        // event.currentTarget.getElementsByTagName('img')[0].classList.add('layer-image__image--active');
      }
    },
    showLayersInfoModal() {
      this.layersInfoOpen = true;
    },
    layersInfoModalOk() {
      this.layersInfoOpen = false;
    },

    scaleChange() {
      const pointResolution = getPointResolution(
        this.map.getView().getProjection(),
        this.map.getView().getResolution(),
        this.map.getView().getCenter(),
        'm',
      );
      const resolutionFactor = pointResolution / this.map.getView().getResolution();
      const resolution = this.scaleValue / this.inchesPerMeter / this.DEFAULT_DPI / resolutionFactor;
      console.log(resolution);
      console.log(
        this.scaleValue /
          getPointResolution(this.map.getView().getProjection(), 72 / 25.4, this.map.getView().getCenter(), 'm'),
      );
      this.map.getView().animate({
        center: this.map.getView().getCenter(),
        resolution: resolution,
        duration: 500,
      });
    },

    mainLayerOpacityChange() {
      VueLayer.getLayerByTitle(this.map, 'Main layers').setOpacity(this.mainLayerOpacity / 100);
    },

    testClick() {
      VueLayer.getLayerByTitle(this.map, 'Main layers').setOpacity(0.5);
    },
  },
});
</script>

<style scoped lang="scss">
.layer-image {
  position: relative;
  width: 55px;
  height: 55px;
  &__image {
    top: -2px;
    left: -2px;
    border: 3px solid #ffffff;
    &--active {
      // top: -1px;
      // left: -1px;
      border: 3px solid #4eee60;
    }
  }
}

.layer-image-container {
  font-size: 0.8rem;
  & * {
    font-size: inherit;
  }
}
</style>
