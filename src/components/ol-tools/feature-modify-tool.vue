<template>
  <div>
    <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
      <template #title>
        <p>Chỉnh sửa lớp bản đồ</p>
      </template>
      <a-button
        class="white-border-ant-button"
        :type="buttonType"
        :ghost="buttonStatus"
        :size="buttonSize"
        @click="openModifyPanel">
        <i class="fa-solid fa-pen-ruler"></i>
      </a-button>
    </a-tooltip>

    <div
      ref="controlPanel"
      class="ol-tool-control-panel feature-edit-control-panel"
      :style="{ display: controlPanelDisplay }">
      <a-card
        title="Chỉnh sửa"
        size="small"
        :bodyStyle="{ padding: '5px', width: '150px', maxHeight: '150px', overflow: 'hidden' }">
        <template #extra>
          <a class="close-button" @click="stopModify"><i class="fa-solid fa-xmark"></i></a>
        </template>
        <a-select
          v-model:value="layerSelected"
          style="width: 100%"
          :options="layerOptions"
          @change="layerChange"
          size="small"
          :dropdownMatchSelectWidth="false"></a-select>
        <a-row class="mt-1" align="middle" justify="space-around">
          <a-col :span="6">
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Lưu thay đổi</p>
              </template>
              <a-button type="primary" size="small" ghost :disabled="saveStatus" @click="save">
                <i class="fa-solid fa-file-export"></i>
              </a-button>
            </a-tooltip>
          </a-col>
          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Thêm đối tượng</p>
              </template>
              <a-button type="primary" size="small" ghost><i class="fa-solid fa-plus"></i></a-button>
            </a-tooltip>
          </a-col>
          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Điều chỉnh đối tượng</p>
              </template>
              <a-button type="primary" size="small" :ghost="!modifyStatus" @click="toggleModify">
                <i class="fa-solid fa-bezier-curve"></i>
              </a-button>
            </a-tooltip>
          </a-col>
          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Chọn đối tượng</p>
              </template>
              <a-button type="primary" size="small" ghost @click="testClick2">
                <i class="fa-solid fa-hand-pointer"></i>
              </a-button>
            </a-tooltip>
          </a-col>
        </a-row>
        <a-row class="mt-1" align="middle" justify="space-around">
          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Xoá đối tượng</p>
              </template>
              <a-button type="primary" size="small" ghost danger :disabled="true" @click="removeFeature">
                <i class="fa-solid fa-trash-can"></i>
              </a-button>
            </a-tooltip>
          </a-col>
          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Xoá đối tượng</p>
              </template>
              <a-button type="primary" size="small" ghost danger @click="testClick"> Tét </a-button>
            </a-tooltip>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <div id="remove-point-overlay">
      <!-- <i class="fa-solid fa-xmark"></i>
      xoá đỉnh -->
      <a-button type="primary" size="small" ghost danger @click="removePoint">
        <template #icon><i class="fa-solid fa-xmark"></i></template>
      </a-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue';
import { mapState } from '@/stores/map-state';
import * as VueLayer from '@/js/openlayers/VueLayer.js';
import thuyLoiApi from '@/js/axios/thuyLoiApi.js';

import { WKB } from 'ol/format';
import Overlay from 'ol/Overlay.js';
import { Select, Modify } from 'ol/interaction';
import { Style, Icon, Stroke, Circle, Fill, Text, RegularShape, Image } from 'ol/style.js';
import ol_interaction_ModifyTouch from 'ol-ext/interaction/ModifyTouch.js';
import { MultiPoint } from 'ol/geom.js';

export default defineComponent({
  setup() {
    const buttonSize = inject('buttonSize');

    return {
      buttonSize,
    };
  },

  data() {
    return {
      buttonStatus: false,
      buttonType: 'primary',
      controlPanelDisplay: 'none',
      layerSelected: '',
      layerOptions: [
        {
          value: 'Hồ chứa layer',
          label: 'Hồ chứa',
        },
        {
          value: 'Cửa xả layer',
          label: 'Cửa xả',
        },
        {
          value: 'Kênh layer',
          label: 'Kênh',
        },
      ],
      modifyStatus: false,
      featureCollections: {
        new: [],
        modify: [],
        remove: [],
      },
      vertexSelected: null,
      saveStatus: true,

      vertexPolygonStyle: new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({
            color: '#f5425a',
          }),
        }),
        geometry: function (feature) {
          const coordinates = feature.getGeometry().getCoordinates()[0];
          let totalPoint = [];
          for (var i = 0; i < coordinates.length; i++) {
            totalPoint = [...totalPoint, ...coordinates[i]];
          }
          return new MultiPoint(totalPoint);
        },
      }),

      vertexLineStyle: new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({
            color: '#f5425a',
          }),
        }),
        geometry: function (feature) {
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      }),
    };
  },

  computed: {
    // Lúc làm redo/undo là lần đầu tiên sẽ lưu vào cái gốc và thay đổi đầu tiên
    // Các lần thay đổi tiếp theo chỉ thêm 1
    // Redo thì chạy ngược lại lệnh 1 lệnh trước cho đến hết thì thôi

    // Hoặc có thể 1 lúc lưu cả lệnh thay đổi và lệnh cũ
    // Ví dụ phát đầu tiên sẽ là geom gốc và thay đổi 1
    // Khi thay đổi thứ 2 sẽ lưu thay đổi 1 và thay đổi 2

    // Mỗi lần modify sẽ lưu gốc và thay đổi
    // Undo thì chạy lệnh gốc,
    // Khi undo sẽ lưu vào kho redo lệnh thay đổi
    map() {
      return mapState().getMap;
    },
    featureModifySelect() {
      const modifyLabelStyles = {
        MultiLineString: [
          new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 2,
            }),
          }),
          this.vertexLineStyle,
        ],
        LineString: [
          new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 2,
            }),
          }),
          this.vertexLineStyle,
        ],
        Point: new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: 'pink',
            }),
            stroke: new Stroke({
              color: 'white',
              width: 1,
            }),
          }),
        }),
        MultiPolygon: [
          new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 3,
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)',
            }),
          }),
          this.vertexPolygonStyle,
        ],
        Polygon: [
          new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 3,
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)',
            }),
          }),
          this.vertexPolygonStyle,
        ],
        Circle: new Style({
          stroke: new Stroke({
            color: 'cyan',
            width: 1,
          }),
          fill: new Fill({
            color: 'rgba(243, 138, 138, 0.5)',
          }),
        }),
      };

      const featureModifySelect = new Select({
        wrapX: false,
        style: function (feature) {
          return modifyLabelStyles[feature.getGeometry().getType()];
        },
        hitTolerance: 5,
      });
      featureModifySelect.set('title', 'Feature modify select');
      featureModifySelect.setActive(false);

      return featureModifySelect;
      // return VueLayer.getInteractionByTitle(this.map, 'Feature modify select');
    },
    featureModify() {
      // Lỗi mỗi khi xoá một point thì sau khi bỏ chọn vẫn modify được
      // Line đó cũng bị lỗi sau khi chọn tiếp sau đó và modify
      // Khi tạo các interaction ở map.js thì nó lỗi
      // Phải dùng cách này để khi xoá một vertex và bỏ chọn đi nó không sửa được nữa
      const modify = new ol_interaction_ModifyTouch({
        wrapX: false,
        features: this.featureModifySelect.getFeatures(),
      });

      const removePointOverlay = new Overlay({
        title: 'Remove point overlay',
        id: 'removePointOverlay',
        // positioning: 'center-center',
        offset: [15, -10],
        position: undefined,
        element: document.getElementById('remove-point-overlay'),

        // stopEvent: false,
      });
      this.map.addOverlay(removePointOverlay);

      modify.on('showpopup', function (e) {
        const removePointCoordinate = e.coordinate;
        removePointOverlay.setPosition(removePointCoordinate);
      });
      modify.on('hidepopup', function (e) {
        removePointOverlay.setPosition(undefined);
      });

      return modify;
    },
  },

  watch: {
    map: {
      handler() {
        this.addModifyEvent();
      },
      deep: false,
      once: true,
    },

    featureCollections: {
      handler(newValue, oldValue) {
        this.saveStatus = !(
          this.featureCollections.modify.length > 0 ||
          this.featureCollections.new.length > 0 ||
          this.featureCollections.remove.length > 0
        );
      },
      deep: true,
    },
  },

  methods: {
    addModifyEvent() {
      let that = this;
      this.map.addInteraction(this.featureModifySelect);
      this.map.addInteraction(this.featureModify);

      this.featureModify.on('modifystart', (e) => {
        // Chạy thử có phải cái này sẽ cho ra geom trước khi thay đổi không

        // Đã thử và có khác
        // Khi start ta sẽ có geom của feature trước khi được modify
        console.log(e.features.getArray()[0].getGeometry().getCoordinates());
      });

      this.featureModify.on('modifyend', (e) => {
        const feature = e.features.getArray()[0];
        console.log(feature.getGeometry().getCoordinates());
        // console.log(this.featureModifySelect.getFeatures());
        // console.log(e.features.getArray());
        if (feature) {
          const featureLayer = feature.getId().split('.')[0];
          const featureGid = feature.getId().split('.')[1];

          const featureGeometry = feature.getGeometry();
          const wkbFormat = new WKB();
          const geom = wkbFormat.writeGeometry(featureGeometry);

          for (let i = 0; i < that.featureCollections.modify.length; i++) {
            if (that.featureCollections.modify[i].gid === featureGid) {
              that.featureCollections.modify[i].geom = geom;
              // console.log(that.featureCollections.modify);
              return;
            }
          }
          // console.log(that.featureCollections.modify);
          that.featureCollections.modify.push({ layer: featureLayer, gid: featureGid, geom: geom });
          // console.log(that.featureModifySelect.getFeatures());
        }
      });
    },

    addDrawNewFeatureEvent() {},

    layerChange() {
      this.featureModifySelect.layerFilter_ = (layer) => {
        if (layer.get('title') == this.layerSelected) return true;
      };
      this.changeModifyStatus(false);
      // this.featureModifySelect.setActive(true);
      // this.featureModify.setActive(true);
    },
    closeModifyPanel() {
      this.controlPanelDisplay = 'none';
      this.buttonStatus = false;
      this.buttonType = 'primary';
    },
    openModifyPanel() {
      if (!this.buttonStatus) {
        this.controlPanelDisplay = 'block';
        this.buttonStatus = true;
        this.buttonType = 'default';
      } else {
        this.closeModifyPanel();
      }
    },

    removeFeature() {},
    changeModifyStatus(boolean) {
      this.modifyStatus = boolean;
      this.featureModifySelect.setActive(this.modifyStatus);
      this.featureModify.setActive(this.modifyStatus);
      this.featureModifySelect.getFeatures().clear();
    },
    toggleModify() {
      //Thử làm thêm Drag
      if (!this.layerSelected) return;
      this.changeModifyStatus(!this.modifyStatus);
    },

    save() {
      thuyLoiApi
        .post('/update-feature-geom', this.featureCollections)
        .then((response) => {
          console.log(response);
          this.featureCollections = {
            new: [],
            modify: [],
            remove: [],
          };
          VueLayer.getLayerByTitle(this.map, this.layerSelected, 1).getSource().refresh();
          this.$message.success(response.data.message, 3);
        })
        .catch((error) => {
          console.log(error);
          this.$message.success(error.response.data.message, 3);
        });
    },

    removePoint() {
      this.featureModify.removePoint();
    },

    testClick() {
      this.featureModify.setActive(false);
    },
    testClick2() {
      this.featureModify.setActive(true);
    },
  },

  mounted() {
    const container = document.getElementById('map-container');
    container.appendChild(this.$refs.controlPanel);
  },
});
</script>

<style lang="scss">
.ol-popup.modifytouch a:before {
  content: '\274C';
  margin-right: 0.2em;
}

#remove-point-overlay {
  // border: 1px black solid;
  // border-radius: 5px;
  // padding: 2px;
  // &:hover {
  //   color: red;
  //   border: 1px red solid;
  //   cursor: pointer;
  //   user-select: none;
  // }
}
</style>
