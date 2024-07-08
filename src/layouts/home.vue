<template>
  <a-spin :spinning="homeSpinning" size="large">
    <a-layout style="height: 100vh">
      <a-layout-header class="home-header">
        <a-row style="height: 100%">
          <a-col
            class="center-col"
            :xs="{ span: 4, offset: 0 }"
            :md="{ span: 2, offset: 0 }"
            :xl="{ span: 2, offset: 0 }">
            <a href="/">
              <img v-if="!screens.xs" src="../assets/Logo_BoNongNghiep.png" alt="" style="height: 5rem; width: 5rem" />
              <img v-else src="../assets/Logo_BoNongNghiep.png" alt="" style="height: 4rem; width: 4rem" />
            </a>
          </a-col>

          <a-col
            class="center-col"
            :xs="{ span: 16, offset: 0 }"
            :md="{ span: 14, offset: 4 }"
            :xl="{ span: 15, offset: 2 }">
            <h1 :style="{ 'font-size': screens.xs ? '0.9rem' : '1.1rem' }">
              HỆ THỐNG QUẢN LÝ CÔNG TRÌNH THUỶ LỢI QUẢNG NAM <br />
              <span v-if="!screens.xs"> QUANG NAM IRRIGATION MANAGEMENT SYSTEM </span>
            </h1>
          </a-col>

          <a-col :xs="{ span: 0, offset: 0 }" :sm="{ span: 0, offset: 0 }" :xl="{ span: 5, offset: 0 }">
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
              <!-- <a-button class="header-link no-border-ant-button">
                <a href="#">Liên Hệ</a>
              </a-button> -->
            </a-row>
          </a-col>

          <a-col :xs="{ span: 4, offset: 0 }" :sm="{ span: 4, offset: 0 }" :xl="{ span: 0, offset: 0 }">
            <a-row class="h-100 mt-2" justify="space-around" align="middle">
              <a-button class="header-link no-border-ant-button">
                <a href="#"> <i class="fa-solid fa-bars-staggered"></i> </a>
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
              border-bottom: 0.5px solid #fff;
              box-shadow: 1.95px 1.95px 2.6px rgba(0, 0, 0, 0.15);
            ">
            <a-row style="height: 100%">
              <a-col :xs="{ span: 0, offset: 0 }" :sm="{ span: 0, offset: 0 }" :xl="{ span: 4, offset: 0 }">
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

              <a-col :xs="{ span: 8, offset: 0 }" :sm="{ span: 4, offset: 0 }" :xl="{ span: 0, offset: 0 }">
                <a-flex class="h-100" align="center">
                  <a-dropdown class="ms-2">
                    <template #overlay>
                      <a-menu>
                        <a-menu-item key="1" @click="danhMucClick"> Danh mục </a-menu-item>
                        <a-menu-item key="2" @click="truyVanClick"> Truy vấn </a-menu-item>
                      </a-menu>
                    </template>
                    <a-button size="small" class="white-border-ant-button" type="primary">
                      <p>
                        <span v-if="siderLayerManagerState.activeSiderTab == 'layersTab'"> Danh mục </span>
                        <span v-else-if="siderLayerManagerState.activeSiderTab == 'searchingTab'"> Truy vấn </span>
                        <i class="fa-solid fa-caret-down"></i>
                      </p>
                    </a-button>
                  </a-dropdown>
                </a-flex>
              </a-col>

              <a-col :xs="{ span: 4, offset: 0 }" :sm="{ span: 9, offset: 0 }" :xl="{ span: 6, offset: 0 }">
                <ToolContainer></ToolContainer>
              </a-col>

              <a-col
                class="center-col"
                :xs="{ span: 10, offset: 0 }"
                :sm="{ span: 6, offset: 0 }"
                :xl="{ span: 4, offset: 0 }">
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
                    <IrrigationToolContainer
                      v-if="createReportsPermission"
                      :safety="hasPermission(10)"
                      :maintain="hasPermission(8)"
                      :operation="hasPermission(6)">
                    </IrrigationToolContainer>

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

import { Grid } from 'ant-design-vue';

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
    if (userState().getLogin || getItem('accessToken') == '') {
      next((data) => {
        data.homeSpinning = false;
      });
    } else if (!userState().getLogin) {
      next((data) => {
        const getAuthenticatedUser = () => {
          thuyLoiApi
            .get(
              '/get-authenticated-user',

              {
                headers: {
                  Authorization: `Bearer ${getItem('accessToken')}`,
                },
              },
            )
            .then((response) => {
              if (response) {
                setItem('user', JSON.stringify(response.data.user));
                userState().onAuthentication(response.data.user);
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

    const useBreakpoint = Grid.useBreakpoint;
    const screens = useBreakpoint();
    const siderCollapsed = ref();

    return {
      sliderValue,
      siderLayerManagerState,
      buttonSize,
      screens,
      siderCollapsed,
    };
  },
  data() {
    return {
      // siderCollapsed: false,
      homeSpinning: true,
    };
  },

  computed: {
    loginState() {
      return userState().getLogin;
    },

    createReportsPermission() {
      const policies = [6, 8, 10];
      if (this.loginState) {
        return userState().getUserProfile.allPolicies.find((policy) => policies.includes(policy.id));
      } else {
        return false;
      }
    },
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
    hasPermission(policyId) {
      if (this.loginState) {
        return userState().getUserProfile.allPolicies.find((policy) => policy.id == policyId) ? true : false;
      } else {
        return false;
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
