<template>
  <a-spin :spinning="homeSpinning" size="large">
    <a-layout style="height: 100vh">
      <a-layout-header class="home-header">
        <a-row style="height: 100%">
          <a-col class="center-col" :span="2">
            <a href="/">
              <img src="../assets/Logo_BoNongNghiep.png" alt="" style="height: 5rem; width: 5rem" />
            </a>
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
          <a-layout-header
            style="
              background-color: #0460ae;
              height: 5vh;
              padding: 0;
              line-height: normal !important;
              box-shadow: 1.95px 1.95px 2.6px rgba(0, 0, 0, 0.15);
            ">
            <a-row style="height: 100%">
              <a-col :span="4">
                <a-row class="h-100" justify="space-between" align="middle">
                  <a-button
                    class="white-border-ant-button ms-2"
                    type="primary"
                    @click="danhMucClick"
                    :size="buttonSize"
                    style="padding-left: 15px; padding-right: 15px">
                    Danh Mục
                  </a-button>
                  <a-button
                    class="white-border-ant-button"
                    type="primary"
                    @click="truyVanClick"
                    :size="buttonSize"
                    style="padding-left: 15px; padding-right: 15px">
                    Truy vấn
                  </a-button>
                </a-row>
              </a-col>

              <a-col :span="6" class="h-100">
                <ToolContainer></ToolContainer>
              </a-col>

              <a-col class="center-col" :span="4">
                <SearchByNameTool></SearchByNameTool>
              </a-col>
            </a-row>
          </a-layout-header>

          <a-layout-content>
            <a-layout class="h-100">
              <a-layout-sider
                v-model:collapsed="siderCollapsed"
                theme="light"
                :collapsed-width="0"
                style="box-shadow: 1.95px 1.95px 2.6px rgba(0, 0, 0, 0.15); z-index: 1">
                <SiderLayerManager></SiderLayerManager>
              </a-layout-sider>
              <a-layout-content style="height: 100%">
                <div ref="mapContainer" id="map-container" class="content-container h-100" style="position: relative">
                  <div id="map" class="map h-100"></div>
                  <div class="bottom-right-nav align-items-center">
                    <IrrigationToolContainer></IrrigationToolContainer>
                    <LayerManager class="mt-5"></LayerManager>
                  </div>
                  <LegendControl></LegendControl>
                </div>
              </a-layout-content>
            </a-layout>
          </a-layout-content>
        </a-layout>
      </a-layout-content>
      <!-- <a-layout-footer
        style="
          background-color: #0460ae;
          height: 5vh;
          padding: 0;
          line-height: normal !important;
          box-shadow: 1.95px 1.95px 2.6px rgba(0, 0, 0, 0.15);
        ">
        <a-row style="height: 100%">
          <a-col :span="4">
            <a-row class="h-100" justify="space-between" align="middle">
              <a-button
                class="white-border-ant-button ms-2"
                type="primary"
                style="padding-left: 15px; padding-right: 15px"
                @click="test">
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
      </a-layout-footer> -->

      <Login></Login>
      <div class="none" id="none" style="display: none"></div>
    </a-layout>
  </a-spin>
</template>

<script>
import { defineComponent, ref, provide } from 'vue';
import { mapState } from '../stores/map-state';
import { userState } from '@/stores/user-state';
import { getItem, setItem, removeItem } from '@/js/utils/localStorage.js';
import thuyLoiApi from '@/js/axios/thuyLoiApi';

import runMap from '../js/openlayers/map.js';

import ToolContainer from '../components/ol-tools/tool-container.vue';
import SiderLayerManager from '../components/sider/layer-manager.vue';
import LayerManager from '../components/ol-tools/layer-manager.vue';
import SearchByNameTool from '../components/sider/search-by-name-tool.vue';
import LegendControl from '@/components/ol-tools/legend-control.vue';
import Login from '@/components/login/login.vue';
import IrrigationToolContainer from '@/components/irrigation-tools/tool-container.vue';

export default defineComponent({
  components: {
    ToolContainer,
    SiderLayerManager,
    LayerManager,
    SearchByNameTool,
    LegendControl,
    Login,
    IrrigationToolContainer,
  },

  beforeRouteEnter(to, from, next) {
    if (userState().getLogin) {
      next((data) => {
        data.homeSpinning = false;
      });
    } else if (!userState().getLogin) {
      next((data) => {
        const getAuthenticatedUser = () => {
          thuyLoiApi
            .post(
              '/get-authenticated-user',
              {},
              {
                headers: {
                  Authorization: `Bearer ${getItem('accessToken')}`,
                },
              },
            )
            .then((response) => {
              if (response) {
                setItem('user', JSON.stringify(response.data.user));
                userState().onAuthentication(response.data.user, response.data.avatar);
                console.log(userState().getUserProfile);

                data.homeSpinning = false;
              }
            })
            .catch((error) => {
              console.log(error);
              data.homeSpinning = false;
              removeItem('accessToken');
              removeItem('user');
              userState().onLogout();
            });
        };

        if (getItem('accessToken') === '') data.homeSpinning = false;
        else getAuthenticatedUser();
      });
    }
  },

  setup() {
    const userStore = userState();

    const searchResult = ref([]);
    provide('searchResult', searchResult);

    const sliderValue = ref(100);

    const mainLayerData = ref([
      // new URL('/src/assets/layer-image/nobasemap.png', import.meta.url)
      {
        title: 'Hồ chứa layer',
        displayName: 'Hồ chứa',
        imagePath: new URL('/src/assets/sample-image/0-1.jpg', import.meta.url),
        visible: true,
      },
    ]);
    provide('mainLayerData', mainLayerData);

    const siderLayerManagerState = ref({
      searchingTabSpinning: false,
      activeSiderTab: 'layersTab',
    });
    provide('siderLayerManagerState', siderLayerManagerState);

    const featurePropShow = ref({
      originalLayerTitle: '',
      props: [],
      displayName: '',
      originalName: '',
      id: '',
    });
    provide('featurePropShow', featurePropShow);

    const buttonSize = ref('small');
    provide('buttonSize', buttonSize);
    const tooltipBackground = ref('geekblue');
    provide('tooltipBackground', tooltipBackground);

    if (window.innerWidth > 1600) buttonSize.value = 'medium';

    return {
      sliderValue,
      siderLayerManagerState,
      buttonSize,
    };
  },
  data() {
    return {
      siderCollapsed: false,
      homeSpinning: true,
    };
  },

  loginState: function () {
    return userState().getLogin;
  },

  methods: {
    danhMucClick() {
      if (this.siderLayerManagerState.activeSiderTab == 'layersTab') {
        this.siderCollapsed = !this.siderCollapsed;
      } else {
        this.siderLayerManagerState.activeSiderTab = 'layersTab';
        this.siderCollapsed = false;
      }
    },
    truyVanClick() {
      if (this.siderLayerManagerState.activeSiderTab == 'searchingTab') {
        this.siderCollapsed = !this.siderCollapsed;
      } else {
        this.siderLayerManagerState.activeSiderTab = 'searchingTab';
        this.siderCollapsed = false;
      }
    },
    test() {},
  },
  mounted() {
    const mapStore = mapState();
    const { getMap, setMap } = mapStore;
    setMap(runMap());

    // document.getElementsByClassName('ol-closebox')[1].addEventListener('click', function () {
    //   // console.log('anhquyendeptraivcl');
    // });
    // console.log(userState().getLogin);
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

.header-link {
  font-weight: bold;
}

.white-border-ant-button {
  border: 1px solid #fff !important;
  // background-color: transparent !important;
}

.bottom-right-nav {
  position: absolute;
  bottom: 4vh;
  right: 1vw;
  display: flex;
  flex-direction: column;
}
</style>
