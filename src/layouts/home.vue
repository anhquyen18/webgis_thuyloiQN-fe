<template>
  <a-layout style="height: 100vh">
    <a-layout-header class="home-header">
      <a-row style="height: 100%">
        <a-col class="center-col" :span="2">
          <img src="../assets/Logo_BoNongNghiep.png" alt="" style="height: 5rem; width: 5rem" />
        </a-col>
        <a-col class="center-col" :span="12" :offset="3">
          <h1 style="font-size: 1.1rem">
            HỆ THỐNG QUẢN LÝ CÔNG TRÌNH THUỶ LỢI QUẢNG NAM <br />
            QUANG NAM IRRIGATION MANAGEMENT SYSTEM
          </h1>
        </a-col>
        <a-col :span="7">
          <a-row class="h-100 mt-2" justify="space-around" align="middle">
            <a-button class="header-link no-border-ant-button">
              <a href="#"> Trang Chủ </a>
            </a-button>
            <a-button class="header-link no-border-ant-button">
              <a href="#">Giới Thiệu</a>
            </a-button>
            <a-button class="header-link no-border-ant-button">
              <a href="#">Quản Lý</a>
            </a-button>
            <a-button class="header-link no-border-ant-button">
              <a href="#">Tin Tức</a>
            </a-button>
            <a-button class="header-link no-border-ant-button">
              <a href="#">Liên Hệ</a>
            </a-button>
          </a-row>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content>
      <a-layout style="height: 100%">
        <a-layout-header style="background-color: #0460ae; height: 5vh; padding: 0; line-height: normal !important">
          <a-row style="height: 100%">
            <a-col :span="4">
              <a-row class="h-100" justify="space-between" align="middle">
                <a-button
                  class="white-border-ant-button ms-2"
                  type="primary"
                  @click="danhMucClick"
                  size="small"
                  style="padding-left: 15px; padding-right: 15px">
                  Danh Mục
                </a-button>
                <a-button
                  class="white-border-ant-button"
                  type="primary"
                  @click="truyVanClick"
                  size="small"
                  style="padding-left: 15px; padding-right: 15px">
                  Truy vấn
                </a-button>
              </a-row>
            </a-col>

            <a-col :span="5" class="h-100">
              <ToolContainer></ToolContainer>
            </a-col>

            <a-col class="center-col" :span="4">
              <a-input-search class="ms-4" placeholder="Tìm kiếm..." enter-button />
            </a-col>
          </a-row>
        </a-layout-header>

        <a-layout-content>
          <a-layout class="h-100">
            <a-layout-sider v-model:collapsed="siderCollapsed" theme="light" :collapsed-width="0">
              <SiderLayerManager></SiderLayerManager>
            </a-layout-sider>
            <a-layout-content style="height: 100%">
              <div ref="mapContainer" id="map-container" class="content-container h-100" style="position: relative">
                <div id="map" class="map h-100"></div>
                <div class="bottom-right-nav align-items-center">
                  <LayerManager class="mt-5"></LayerManager>
                </div>
              </div>
            </a-layout-content>
          </a-layout>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="background-color: #0460ae; height: 5vh; padding: 0; line-height: normal !important">
      <a-row style="height: 100%">
        <a-col :span="4">
          <a-row class="h-100" justify="space-between" align="middle">
            <a-button
              class="white-border-ant-button ms-2"
              type="primary"
              style="padding-left: 15px; padding-right: 15px">
              Chú thích
            </a-button>

            <a-button
              class="white-border-ant-button ms-2"
              type="primary"
              style="padding-left: 15px; padding-right: 15px">
              Overview map
            </a-button>
          </a-row>
        </a-col>
        <a-col :span="4" :offset="1">
          <a-row class="h-100" align="middle">
            <a-col :span="8">
              <span class="text-white">Trong suốt: </span>
            </a-col>
            <a-col :span="16">
              <a-slider id="test" v-model:value="sliderValue" size="small" />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="4"> </a-col>
      </a-row>
    </a-layout-footer>

    <a-row class="sign-in-button-panel">
      <a-col :span="10" :offset="4">
        <a-button class="no-border-ant-button fw-bold" size="small" ghost>Đăng nhập</a-button>
      </a-col>
      <a-col :span="10">
        <a-button class="no-border-ant-button fw-bold" size="small" ghost>Đăng ký</a-button>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script>
import { defineComponent, ref, provide } from 'vue';
import { mapState } from '../stores/map-state';
import runMap from '../js/openlayers/map.js';

import ToolContainer from '../components/ol-tools/tool-container.vue';
import SiderLayerManager from '../components/sider/layer-manager.vue';
import LayerManager from '../components/ol-tools/layer-manager.vue';
export default defineComponent({
  components: {
    ToolContainer,
    SiderLayerManager,
    LayerManager,
  },
  setup() {
    const sliderValue = ref(100);
    const activeSiderTab = ref('layersTab');
    provide('activeSiderTab', activeSiderTab);
    const mainLayerData = ref([
      {
        title: 'Hồ chứa layer',
        displayName: 'Hồ chứa',
        imagePath: '',
        visible: true,
      },
    ]);
    provide('mainLayerData', mainLayerData);

    return {
      sliderValue,
      activeSiderTab,
    };
  },
  data() {
    return {
      siderCollapsed: false,
    };
  },
  computed: {},
  methods: {
    danhMucClick() {
      if (this.activeSiderTab == 'layersTab') {
        this.siderCollapsed = !this.siderCollapsed;
      } else {
        this.activeSiderTab = 'layersTab';
        this.siderCollapsed = false;
      }
    },
    truyVanClick() {
      if (this.activeSiderTab == 'searchingTab') {
        this.siderCollapsed = !this.siderCollapsed;
      } else {
        this.activeSiderTab = 'searchingTab';
        this.siderCollapsed = false;
      }
    },
  },
  mounted() {
    const mapStore = mapState();
    const { getMap, setMap } = mapStore;
    setMap(runMap());
  },
});
</script>

<style lang="scss">
.map-container {
  position: relative;
}
.home-header {
  background-color: #ffffff !important;
  height: 10vh !important;
  padding: 0 !important;
  line-height: normal !important;
}
.center-col {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}

.header-link {
  font-weight: bold;
}

.no-border-ant-button {
  border: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.white-border-ant-button {
  border: 1px solid #fff !important;

  // background-color: transparent !important;
}

.sign-in-button-panel {
  width: 18vw;
  height: 3vh;
  background-color: red;
  position: fixed;
  top: 0;
  right: 0;
  clip-path: polygon(0 0, 100% 0%, 100% 100%, 10% 100%);
  background: rgb(2, 0, 36);
  background: linear-gradient(167deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 16%, rgba(0, 212, 255, 1) 100%);
}

.bottom-right-nav {
  position: absolute;
  bottom: 2vh;
  right: 1vw;
  display: flex;
  flex-direction: column;
}

.map .ol-zoom {
  position: absolute;
  top: 35vh;
  left: auto;
  right: 2vw;
}
</style>
