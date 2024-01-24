<template>
  <a-card
    class="sider-content"
    :active-tab-key="siderLayerManagerState.activeSiderTab"
    :bodyStyle="{ padding: 0, backgroundColor: '#ffffff !important' }"
    style="border: none"
    :headStyle="{ borderRadius: '0.5rem' }">
    <div v-if="siderLayerManagerState.activeSiderTab === 'layersTab'">
      <!-- <a-menu class="layers-visible-menu" mode="inline" style="border: none">
          <a-sub-menu key="sub1">
            <template #title>
              <a-row>
                <icon>
                  <template #component>
                    <img
                      src="../../assets/icon/lake.png"
                      alt=""
                      style="height: 1.5rem; width: 1.5rem"
                    />
                  </template>
                </icon>
                <span>Hồ chứa</span>
              </a-row>
            </template>
            <a-sub-menu>
              <template #title>
                <span>Hồ chứa lớn</span>
              </template>
              <a-menu-item key="1" style="padding: 0">
                <span style="text-wrap: wrap"> test </span>
              </a-menu-item>
            </a-sub-menu>
          </a-sub-menu>
        </a-menu> -->
      <a-collapse v-model:activeKey="activeKey" :bordered="false" style="border-radius: 0; background: transparent">
        <a-collapse-panel key="1" header="Hồ chứa">
          <template #extra>
            <icon>
              <template #component>
                <img src="../../assets/icon/lake.png" alt="" style="height: 1rem; width: 1rem" />
              </template>
            </icon>
          </template>
          <a-collapse default-active-key="4" :bordered="false" style="border-radius: 0; background: transparent">
            <template #expandIcon="{ isActive }">
              <CaretRightOutlined :rotate="isActive ? 90 : 0" />
            </template>
            <a-collapse-panel key="1" header="Hồ chứa lớn">
              <a-button
                v-for="lake in lakeData.bigLake"
                class="no-border-ant-button mt-1"
                size="small"
                @click="zoomToFeature(lake)">
                {{ lake.displayname }}
              </a-button>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="Hồ chứa vừa">
              <a-button
                v-for="lake in lakeData.mediumLake"
                class="no-border-ant-button mt-1"
                size="small"
                @click="zoomToFeature(lake)">
                {{ lake.displayname }}
              </a-button>
            </a-collapse-panel>
            <a-collapse-panel key="3" header="Hồ chứa nhỏ">
              <a-button
                v-for="lake in lakeData.smallLake"
                class="no-border-ant-button mt-1"
                size="small"
                @click="zoomToFeature(lake)">
                {{ lake.displayname }}
              </a-button>
            </a-collapse-panel>
          </a-collapse>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="Đập">
          <a-button
            v-for="lake in lakeData.cuaxa"
            class="no-border-ant-button mt-1"
            size="small"
            style="width: 100%; text-wrap: wrap; height: auto; text-align: left"
            @click="zoomToFeature(lake)">
            {{ lake.displayname }}
          </a-button>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="Trạm bơm">
          <p>Đang cập nhật</p>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="Kênh mương">
          <a-button
            v-for="lake in lakeData.kenh"
            class="no-border-ant-button mt-1"
            size="small"
            @click="zoomToFeature(lake)">
            {{ lake.displayname }}
          </a-button>
        </a-collapse-panel>
        <a-collapse-panel key="5" header="Đê kè">
          <p>Đang cập nhật</p>
        </a-collapse-panel>
        <a-collapse-panel key="6" header="Cống">
          <p>Đang cập nhật</p>
        </a-collapse-panel>
        <a-collapse-panel key="7" header="Công trình phụ trợ">
          <p>Đang cập nhật</p>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div v-if="siderLayerManagerState.activeSiderTab === 'searchingTab'">
      <a-spin :spinning="siderLayerManagerState.searchingTabSpinning">
        <a-flex style="padding: 10px" vertical>
          <p v-if="searchResult == ''">Không có kết quả nào được tìm thấy.</p>
          <p v-else-if="searchResult.length > 0" class="fw-bold">Kết quả tìm kiếm:</p>

          <a-button
            v-for="item in searchResult"
            class="no-border-ant-button mt-2"
            size="small"
            @click="zoomToFeature(item)"
            style="text-wrap: wrap; height: auto; text-align: left; align-self: flex-start">
            {{ item.displayname }}
          </a-button>
        </a-flex>
      </a-spin>
    </div>
  </a-card>
</template>

<script>
import { defineComponent, ref, inject } from 'vue';
import Icon, { CaretRightOutlined } from '@ant-design/icons-vue';
import thuyLoiApi from '../../js/axios/thuyLoiApi.js';
import { mapState } from '../../stores/map-state';
import * as VueLayer from '../../js/openlayers/VueLayer.js';

import * as olExtent from 'ol/extent';
import { GeoJSON } from 'ol/format';

export default defineComponent({
  components: {
    Icon,
    CaretRightOutlined,
  },
  setup() {
    const tabList = [
      {
        key: 'layersTab',
        tab: 'Layers',
      },
      {
        key: 'searchingTab',
        tab: 'Searching',
      },
    ];
    const onTabChange = (value) => {
      key.value = value;
    };

    const lakeData = ref('');
    thuyLoiApi
      .get('/get-lakes')
      .then((response) => {
        // console.log(response);
        lakeData.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    const searchResult = inject('searchResult');
    const siderLayerManagerState = inject('siderLayerManagerState');
    const featurePropShow = inject('featurePropShow');

    return {
      tabList,
      onTabChange,
      lakeData,
      searchResult,
      siderLayerManagerState,
      featurePropShow,
    };
  },
  data() {
    return {
      activeKey: ['1'],
    };
  },
  computed: {
    map() {
      return mapState().getMap;
    },
  },
  methods: {
    zoomToFeature(item) {
      console.log(VueLayer.getLayerByTitle(this.map, 'Hồ chứa layer', 1).getStyle());
      VueLayer.getLayerByTitle(this.map, 'Feature highlight layer').getSource().clear();
      popup.classList.remove('ol-popup__active');
      thuyLoiApi
        .post('/get-feature-info', {
          layer: item.layername,
          id: item.gid,
          name: item.name,
        })
        .then((response) => {
          console.log(response);
          // delete response.data['']
          if (response.data.message) {
            this.$message.warning({
              content: () => response.data.message,
              // style: {
              //   marginTop: '10vh',
              // },
            });
          } else {
            let props = response.data;
            delete props['gid'];
            delete props['geom'];

            // Đang sử dụng mảng để triển khai cái props của feature
            // Khi có được tất cả các layer chính thức
            // và có thông tin cần hiển thị cho tất cả thì lúc đó dùng json
            this.featurePropShow.props = [];
            Object.keys(props).forEach((x, i, arr) => {
              if (x != 'geometry' && x != 'HinhAnh') {
                this.featurePropShow.props.push({
                  // key: i + 1,
                  name: x,
                  value: props[x],
                });
              } else if (x == 'geometry') {
                // featureProp.geom = props[x];
              }
            });

            let popup = document.getElementById('popup');
            popup.classList.add('ol-popup__active');
            this.featurePropShow.displayName = item.displayname;
            this.featurePropShow.id = item.gid;
            this.featurePropShow.originalLayerTitle = item.layername;
            this.featurePropShow.originalName = item.name;
          }

          // this.featurePropShow.props
        })
        .catch((error) => {
          console.log(error);
        });

      // this.map.getOverlayById('featurePopupOverlay').setPosition(undefined);
      // console.log(item);

      // props:
      if (item.geojson) {
        let feature = new GeoJSON().readFeature(item.geojson);
        let extent = feature.getGeometry().getExtent();
        this.map.getView().fit(extent, { duration: 1000 });
        VueLayer.getLayerByTitle(this.map, 'Feature highlight layer').setVisible(true);
        VueLayer.getLayerByTitle(this.map, 'Feature highlight layer').getSource().addFeature(feature);
        this.map.getOverlayById('featurePopupOverlay').setPosition(olExtent.getCenter(extent));
      }

      // console.log(this.featurePropShow);
      // console.log(extent);
      // console.log(extent.getCenter(extent));
      // console.log(olExtent.getCenter(extent));
    },

    statusSwitch() {
      this.status = !this.status;
      VueLayer.getLayerByTitle(this.map, 'Feature highlight layer').getSource().clear();
      this.map.getOverlayById('featurePopupOverlay').setPosition(undefined);
      if (this.status) {
        this.buttonType = 'default';
        VueLayer.getLayerByTitle(this.map, 'Feature highlight layer').setVisible(true);
        this.$refs.olPopup.classList.add('ol-popup__active');
      } else {
        this.buttonType = 'primary';
        VueLayer.getLayerByTitle(this.map, 'Feature highlight layer').setVisible(false);
        this.$refs.olPopup.classList.remove('ol-popup__active');
      }
    },
  },
  mounted() {},
});
</script>

<style lang="scss">
.layers-visible-menu .ant-menu-item {
  padding-left: 2rem !important;
}
.icon {
  background: url('luffy-chilling-gear5-round.png');
  height: 20px;
  width: 20px;
  display: block;
  /* Other styles here */
}

.sider-content {
  max-height: 80vh;

  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 3px;
  }
}
</style>
