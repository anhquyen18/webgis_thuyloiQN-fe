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
          v-model="layerOptions"
          :options="layerOptions"
          v-model:value="layerSelected"
          style="width: 100%"
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
              <a-button type="primary" size="small" :ghost="!newFeatureDrawStatus" @click="toggleNewFeatureDraw">
                <i class="fa-solid fa-plus"></i>
              </a-button>
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
              <a-button type="primary" size="small" :ghost="!selectStatus" @click="toggleSelect">
                <i class="fa-solid fa-hand-pointer"></i>
              </a-button>
            </a-tooltip>
          </a-col>
        </a-row>
        <a-row class="mt-1" align="middle" justify="space-around">
          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Thuộc tính đối tượng</p>
              </template>
              <a-button type="primary" size="small" ghost :disabled="!selectedFeature" @click="editFeatureInfo">
                <i class="fa-solid fa-list-ul"></i>
              </a-button>
            </a-tooltip>
          </a-col>

          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Xoá đối tượng</p>
              </template>
              <a-button
                type="primary"
                size="small"
                ghost
                danger
                :disabled="!selectedFeature"
                @click="removeSelectedFeature">
                <i class="fa-solid fa-trash-can"></i>
              </a-button>
            </a-tooltip>
          </a-col>

          <!-- <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Xoá đối tượng</p>
              </template>
              <a-button type="primary" size="small" ghost danger @click="testClick"> Tét </a-button>
            </a-tooltip>
          </a-col> -->
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

    <a-modal v-model:open="newFeatureModalOpen" :maskClosable="false" :closable="false">
      <template #title>
        <a-flex justify="space-between">
          <span class="fs-6"> Tạo đối tượng mới </span>
          <!-- <a class="close-button me-2" @click="closeEditModal"><i class="fa-solid fa-xmark"></i></a> -->
        </a-flex>
      </template>
      <template #footer>
        <!-- <a-button key="back" @click="newFeatureModalCancel">Huỷ</a-button> -->

        <a-button key="submit" type="primary" @click="newFeatureModalSave" style="padding: 0 30px"> Lưu </a-button>

        <!-- <a-button key="submit" type="primary" :loading="editModalSpinning" @click="editSave" style="padding: 0 30px">
            Lưu
          </a-button> -->
      </template>
      <a-spin :spinning="false">
        <a-card style="height: 405px; overflow: auto">
          <a-menu v-model:selectedKeys="newFeatureSelectedKeys" mode="horizontal" :items="newFeatureItems" class="mb-2">
          </a-menu>

          <div v-if="newFeatureSelectedKeys[0] == 1">
            <a-flex v-for="(value, key, index) in featureNameDisplay.generalInfo" class="mb-2 mt-2" :vertical="true">
              <div v-if="key === 'vi_tri'">
                <p class="detail-feature-item--title">{{ value }}</p>
                <div style="display: flex">
                  <p>xã</p>
                  <a-input
                    v-model:value="newFeatureData.generalInfo['vi_tri_xa']"
                    size="small"
                    style="font-size: 0.8rem; width: 150px; margin-left: 5px" />
                  <p>, huyện</p>
                  <a-input
                    v-model:value="newFeatureData.generalInfo['vi_tri_huyen']"
                    size="small"
                    style="font-size: 0.8rem; width: 150px; margin-left: 5px" />
                </div>
              </div>

              <div v-else-if="key === 'co_quy_trinh_vh'">
                <p class="detail-feature-item--title">{{ value }}</p>
                <a-checkbox v-model:checked="newFeatureData.generalInfo[key]">Có hoặc không</a-checkbox>
              </div>

              <div v-else>
                <p class="detail-feature-item--title">{{ value }}</p>
                <a-input v-model:value="newFeatureData.generalInfo[key]" size="small" />
              </div>
            </a-flex>
          </div>
          <div v-if="newFeatureSelectedKeys[0] == 2">
            <a-flex v-for="(value, key, index) in featureNameDisplay.techInfo1" class="mb-2" :vertical="true">
              <p class="detail-feature-item--title">{{ value }}</p>
              <a-input v-model:value="newFeatureData.techInfo1[key]" size="small" />
            </a-flex>
          </div>
          <!-- <div v-if="newFeatureSelectedKeys[0] == 3">
            <div v-for="(item, itemIndex) in newFeatureData.techInfo2">
              <a-divider v-if="featureDataFromDB.techInfo2.length > 1" orientation="left" style="border-color: grey">
                <p style="font-size: 0.8rem">Đập chính {{ itemIndex + 1 }}</p>
              </a-divider>

              <a-flex v-for="(value, key, index) in featureNameDisplay.techInfo2" class="mb-2 mt-2" :vertical="true">
                <p class="detail-feature-item--title">{{ value }}</p>
                <a-input v-model:value="item[key]" size="small" />
              </a-flex>
            </div>
          </div>
          <div v-if="newFeatureSelectedKeys[0] == 4">
            <a-table
              :columns="featureNameDisplay.techInfo3"
              :data-source="newFeatureData.techInfo3"
              :pagination="false"
              style="font-size: 0.8rem">
              <template #bodyCell="{ column, text, record, index }">
                <template v-if="column.dataIndex === 'co_tran_su_co'">
                  <a-checkbox v-model:checked="newFeatureData.techInfo3[index][column.dataIndex]"></a-checkbox>
                </template>

                <template v-else>
                  <a-input
                    v-model:value="newFeatureData.techInfo3[index][column.dataIndex]"
                    size="small"
                    style="font-size: 0.8rem" />
                </template>
              </template>
            </a-table>
          </div>
          <div v-if="newFeatureSelectedKeys[0] == 5">
            <a-table
              :columns="featureNameDisplay.techInfo4"
              :data-source="newFeatureData.techInfo3"
              :pagination="false"
              style="font-size: 0.8rem">
              <template #bodyCell="{ column, text, record, index }">
                <template v-if="column.dataIndex === 'co_tran_su_co'">
                  <a-checkbox v-model:checked="newFeatureData.techInfo3[index][column.dataIndex]"></a-checkbox>
                </template>

                <template v-else>
                  <a-input
                    v-model:value="newFeatureData.techInfo3[index][column.dataIndex]"
                    size="small"
                    style="font-size: 0.8rem" />
                </template>
              </template>
            </a-table>
          </div> -->
        </a-card>
      </a-spin>
    </a-modal>

    <a-modal v-model:open="editFeatureInfoModalOpen" :maskClosable="false" :closable="false">
      <template #title>
        <a-flex justify="space-between">
          <span class="fs-6"> Thay đổi thông tin đối tượng </span>
        </a-flex>
      </template>
      <template #footer>
        <a-button key="back" @click="editFeatureInfoModalCancel">Huỷ</a-button>

        <a-button key="submit" type="primary" @click="editFeatureInfoModalSave" style="padding: 0 30px"> Lưu </a-button>
      </template>
      <a-spin :spinning="false">
        <a-card style="height: 405px; overflow: auto">
          <a-menu
            v-model:selectedKeys="editFeatureInfoSelectedKeys"
            mode="horizontal"
            :items="newFeatureItems"
            class="mb-2">
          </a-menu>

          <div v-if="editFeatureInfoSelectedKeys[0] == 1">
            <a-flex v-for="(value, key, index) in featureNameDisplay.generalInfo" class="mb-2 mt-2" :vertical="true">
              <div v-if="key === 'vi_tri'">
                <p class="detail-feature-item--title">{{ value }}</p>
                <div style="display: flex">
                  <p>xã</p>
                  <a-input
                    v-model:value="newFeatureData.generalInfo['vi_tri_xa']"
                    size="small"
                    style="font-size: 0.8rem; width: 150px; margin-left: 5px" />
                  <p>, huyện</p>
                  <a-input
                    v-model:value="newFeatureData.generalInfo['vi_tri_huyen']"
                    size="small"
                    style="font-size: 0.8rem; width: 150px; margin-left: 5px" />
                </div>
              </div>

              <div v-else-if="key === 'co_quy_trinh_vh'">
                <p class="detail-feature-item--title">{{ value }}</p>
                <a-checkbox v-model:checked="newFeatureData.generalInfo[key]">Có hoặc không</a-checkbox>
              </div>

              <div v-else>
                <p class="detail-feature-item--title">{{ value }}</p>
                <a-input v-model:value="newFeatureData.generalInfo[key]" size="small" />
              </div>
            </a-flex>
          </div>
          <div v-if="editFeatureInfoSelectedKeys[0] == 2">
            <a-flex v-for="(value, key, index) in featureNameDisplay.techInfo1" class="mb-2" :vertical="true">
              <p class="detail-feature-item--title">{{ value }}</p>
              <a-input v-model:value="newFeatureData.techInfo1[key]" size="small" />
            </a-flex>
          </div>
          <!-- <div v-if="editFeatureInfoSelectedKeys[0] == 3">
            <div v-for="(item, itemIndex) in newFeatureData.techInfo2">
              <a-divider v-if="featureDataFromDB.techInfo2.length > 1" orientation="left" style="border-color: grey">
                <p style="font-size: 0.8rem">Đập chính {{ itemIndex + 1 }}</p>
              </a-divider>

              <a-flex v-for="(value, key, index) in featureNameDisplay.techInfo2" class="mb-2 mt-2" :vertical="true">
                <p class="detail-feature-item--title">{{ value }}</p>
                <a-input v-model:value="item[key]" size="small" />
              </a-flex>
            </div>
          </div>
          <div v-if="editFeatureInfoSelectedKeys[0] == 4">
            <a-table
              :columns="featureNameDisplay.techInfo3"
              :data-source="newFeatureData.techInfo3"
              :pagination="false"
              style="font-size: 0.8rem">
              <template #bodyCell="{ column, text, record, index }">
                <template v-if="column.dataIndex === 'co_tran_su_co'">
                  <a-checkbox v-model:checked="newFeatureData.techInfo3[index][column.dataIndex]"></a-checkbox>
                </template>

                <template v-else>
                  <a-input
                    v-model:value="newFeatureData.techInfo3[index][column.dataIndex]"
                    size="small"
                    style="font-size: 0.8rem" />
                </template>
              </template>
            </a-table>
          </div>
          <div v-if="editFeatureInfoSelectedKeys[0] == 5">
            <a-table
              :columns="featureNameDisplay.techInfo4"
              :data-source="newFeatureData.techInfo3"
              :pagination="false"
              style="font-size: 0.8rem">
              <template #bodyCell="{ column, text, record, index }">
                <template v-if="column.dataIndex === 'co_tran_su_co'">
                  <a-checkbox v-model:checked="newFeatureData.techInfo3[index][column.dataIndex]"></a-checkbox>
                </template>

                <template v-else>
                  <a-input
                    v-model:value="newFeatureData.techInfo3[index][column.dataIndex]"
                    size="small"
                    style="font-size: 0.8rem" />
                </template>
              </template>
            </a-table>
          </div> -->
        </a-card>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue';
import { mapState } from '@/stores/map-state';
import * as VueLayer from '@/js/openlayers/VueLayer.js';
import thuyLoiApi from '@/js/axios/thuyLoiApi.js';

import { WKB } from 'ol/format';
import Overlay from 'ol/Overlay.js';
import { Select, Modify, Draw } from 'ol/interaction';
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
          value: 'ho_chua_quang_nam_epsg5899',
          label: 'Hồ chứa',
        },
        {
          value: 'cuaxa',
          label: 'Cửa xả',
        },
        {
          value: 'kenh',
          label: 'Kênh',
        },
      ],
      modifyStatus: false,
      featureCollections: {
        new: [],
        modify: [],
        remove: [],
        properties: [],
      },
      vertexSelected: null,
      saveStatus: true,
      newFeatureDraw: null,
      newFeatureDrawStatus: false,
      newFeatureModalOpen: false,
      newFeatureSelectedKeys: [1],
      selectStatus: false,
      selectedFeature: null,

      editFeatureInfoModalOpen: false,
      editFeatureInfoSelectedKeys: [1],

      newFeature: {
        layer: '',
        gid: '',
        geom: '',
        data: '',
      },
      newFeatureData: {
        generalInfo: {
          ten: '',
          vi_tri: '',
          nam_xd: '',
          don_vi_ql: '',
          co_quy_trinh_vh: false,
        },
        techInfo1: {
          f_tuoi_tk: '',
          f_tuoi_tk: '',
          f_lv: '',
          wmndb: '',
          mnc: '',
          mndbt: '',
          mnltk: '',
          so_dap_phu: '',
        },
        techInfo2: {
          cao_trinh_dinh_tcs: '',
          cao_trinh_dinh_dap: '',
          h_max: '',
          length: '',
        },
        techInfo3: [],
        techInfo4: [],
      },

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

      featureNameDisplay: {
        generalInfo: {
          ten: 'Tên',
          vi_tri: 'Vị trí',
          nam_xd: 'Năm xây dựng',
          don_vi_ql: 'Đơn vị quản lý',
          co_quy_trinh_vh: 'Quy trình vận hành',
        },
        techInfo1: {
          f_tuoi_tk: 'Diện tích tưới thiết kế (ha)',
          f_tuoi_tk: 'Diện tích tưới thực tế (ha)',
          f_lv: 'Diện tích lưu vực (km2)',
          wmndb: 'W mndbt (10^6 m3)',
          mnc: 'Mực nước chết (m)',
          mndbt: 'Mực nước dâng bình thường (m)',
          mnltk: 'Mực nước lũ thiết kế (m)',
          so_dap_phu: 'Số đập phụ',
        },
        techInfo2: {
          cao_trinh_dinh_tcs: 'Cao trình đỉnh tường chắn sóng (m)',
          cao_trinh_dinh_dap: 'Cao trình đỉnh đập (m)',
          h_max: 'H max (m)',
          length: 'Chiều dài đập (m)',
        },
        techInfo3: [
          {
            title: 'Kích thước cống lấy nước (m)',
            dataIndex: 'kich_thuoc_cong',
          },
          {
            title: 'Hình thức cống lấy nước',
            dataIndex: 'hinh_thuc_cong',
          },
        ],
        techInfo4: [
          {
            title: 'Cao trình ngưỡng tràn (m)',
            dataIndex: 'cao_trinh_nguong_tran',
          },
          {
            title: 'B tràn (m)',
            dataIndex: 'b_tran',
          },
          {
            title: 'Hình thức tràn',
            dataIndex: 'hinh_thuc_tran',
          },
          {
            title: 'Tràn sự cố',
            dataIndex: 'co_tran_su_co',
          },
        ],
      },

      newFeatureItems: [
        {
          key: '1',
          label: 'Chung',
          title: 'Chung',
        },
        {
          key: '111',
          label: 'Kỹ thuật',
          title: 'Kỹ thuật',
          children: [
            {
              label: 'Toàn công trình',
              key: '2',
            },
            {
              label: 'Đập chính',
              key: '3',
            },
            {
              label: 'Cống lấy nước',
              key: '4',
            },
            {
              label: 'Tràn xả lũ',
              key: '5',
            },
          ],
        },
      ],
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
    featureSelect() {
      const featureSelect = new Select({
        wrapX: false,
        hitTolerance: 5,
      });
      featureSelect.set('title', 'Feature select (modify)');
      featureSelect.setActive(false);

      return featureSelect;
    },
  },

  watch: {
    map: {
      handler() {
        this.addModifyEvent();
        this.addFeatureSelectEvent();
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
        // console.log(e.features.getArray()[0].getGeometry().getCoordinates());
      });

      this.featureModify.on('modifyend', (e) => {
        const feature = e.features.getArray()[0];
        // console.log(feature.getGeometry().getCoordinates());
        // console.log(this.featureModifySelect.getFeatures());
        // console.log(e.features.getArray());
        if (feature && feature.getId()) {
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
          that.featureCollections.modify.push({ layer: featureLayer, gid: featureGid, geom: geom, properties: null });
          // console.log(that.featureModifySelect.getFeatures());
        } else if (feature && !feature.getId()) {
          const featureGid = feature.get('tempId');
          const featureGeometry = feature.getGeometry();
          const wkbFormat = new WKB();
          const geom = wkbFormat.writeGeometry(featureGeometry);

          for (let i = 0; i < that.featureCollections.new.length; i++) {
            if (that.featureCollections.new[i].gid === featureGid) {
              that.featureCollections.new[i].geom = geom;
              console.log(that.featureCollections.new[i].geom);
              return;
            }
          }
        }
      });
    },

    addFeatureSelectEvent() {
      // Nhớ làm multi select
      this.map.addInteraction(this.featureSelect);

      this.featureSelect.on('select', (e) => {
        // console.log(e);
        const feature = e.selected[0];
        // console.log(e);
        if (feature) {
          this.selectedFeature = feature;
          // if (feature.getId()) {
          //   console.log(feature.getId());
          //   // VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource().removeFeature(feature);
          // } else {
          //   console.log(feature);
          //   // VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource().removeFeature(feature);
          // }
        } else {
          this.selectedFeature = null;
        }
      });
    },

    startNewFeatureDraw() {
      let that = this;
      if (!this.layerSelected || this.newFeatureDraw) {
        // this.$message.warning('Vui lòng chọn lớp bản đồ cần thêm vào');
        return;
      }
      const source = VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource();
      const type = source.getFeatures()[0].getGeometry().getType();

      this.newFeatureDraw = new Draw({
        source: source,
        type: type,
      });
      this.newFeatureDraw.on('drawend', (e) => {
        const feature = e.feature;
        const featureGeometry = feature.getGeometry();
        const wkbFormat = new WKB();
        const geom = wkbFormat.writeGeometry(featureGeometry);
        const tempId = Math.floor(Math.random() * 1000) + 1;
        feature.set('tempId', tempId);
        // console.log(this.layer);
        this.newFeatureModalOpen = true;
        this.newFeature = {
          layer: this.layerSelected,
          gid: tempId,
          geom: geom,
          properties: this.newFeatureData,
        };
        // console.log(geom);
        // that.featureCollections.new.push({ layer: this.layerSelected, gid: tempId, geom: geom, this. });
        // console.log(VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).get('dbName'));
      });

      this.map.addInteraction(this.newFeatureDraw);
      this.newFeatureDrawStatus = true;
    },

    stopNewFeatureDraw() {
      this.map.removeInteraction(this.newFeatureDraw);
      this.newFeatureDraw = null;
      this.newFeatureDrawStatus = false;
    },

    toggleNewFeatureDraw() {
      // this.newFeatureDrawStatus = !this.newFeatureDrawStatus;
      // console.log(this.newFeatureDrawStatus);
      this.changeModifyStatus(false);
      this.changeSelectStatus(false);
      if (this.newFeatureDrawStatus) {
        this.stopNewFeatureDraw();
      } else {
        this.startNewFeatureDraw();
      }
    },

    layerChange() {
      this.featureModifySelect.layerFilter_ = (layer) => {
        if (layer.get('dbName') == this.layerSelected) return true;
      };
      this.featureSelect.layerFilter_ = (layer) => {
        if (layer.get('dbName') == this.layerSelected) return true;
      };
      this.changeModifyStatus(false);
      this.stopNewFeatureDraw();
      this.changeSelectStatus(false);
      // console.log(this.);
      // this.featureModifySelect.setActive(true);
      // this.featureModify.setActive(true);
    },

    closeModifyPanel() {
      this.controlPanelDisplay = 'none';
      this.buttonStatus = false;
      this.buttonType = 'primary';
      this.changeModifyStatus(false);
      this.stopNewFeatureDraw();
      this.changeSelectStatus(false);
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

    changeModifyStatus(boolean) {
      this.modifyStatus = boolean;
      this.featureModifySelect.setActive(this.modifyStatus);
      this.featureModify.setActive(this.modifyStatus);
      this.featureModifySelect.getFeatures().clear();
    },
    toggleModify() {
      if (!this.layerSelected) return;
      this.changeModifyStatus(!this.modifyStatus);
      this.stopNewFeatureDraw();
      this.changeSelectStatus(false);
    },

    changeSelectStatus(boolean) {
      this.selectStatus = boolean;
      this.featureSelect.setActive(this.selectStatus);
      this.featureSelect.getFeatures().clear();
      this.selectedFeature = null;
      // console.log(this.featureSelect.getActive());
    },

    toggleSelect() {
      if (!this.layerSelected) return;
      this.changeSelectStatus(!this.selectStatus);
      this.changeModifyStatus(false);
      this.stopNewFeatureDraw();
    },

    removeSelectedFeature() {
      if (this.selectedFeature) {
        VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource().removeFeature(this.selectedFeature);
        if (this.selectedFeature.getId()) {
          const featureLayer = this.selectedFeature.getId().split('.')[0];
          const featureGid = this.selectedFeature.getId().split('.')[1];
          this.featureCollections.remove.push({ layer: featureLayer, gid: featureGid });
        } else {
          const gid = this.selectedFeature.get('tempId');
          this.featureCollections.new = this.featureCollections.new.filter((item) => item.gid != gid);
        }
        this.selectedFeature = null;
      }
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
          VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource().refresh();
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

    newFeatureModalCancel() {
      this.newFeatureModalOpen = false;

      this.newFeatureData = {
        generalInfo: {
          ten: '',
          vi_tri: '',
          nam_xd: '',
          don_vi_ql: '',
          co_quy_trinh_vh: false,
        },
        techInfo1: {
          f_tuoi_tk: '',
          f_tuoi_tk: '',
          f_lv: '',
          wmndb: '',
          mnc: '',
          mndbt: '',
          mnltk: '',
          so_dap_phu: '',
        },
        techInfo2: {
          cao_trinh_dinh_tcs: '',
          cao_trinh_dinh_dap: '',
          h_max: '',
          length: '',
        },
        techInfo3: [],
        techInfo4: [],
      };
      this.featureCollections.new.push(this.newFeature);
      this.newFeature = null;
    },

    newFeatureModalSave() {
      // console.log(this.newFeatureData);
      this.featureCollections.new.push(this.newFeature);
      this.newFeature = null;
      this.newFeatureData = {
        generalInfo: {
          ten: '',
          vi_tri: '',
          nam_xd: '',
          don_vi_ql: '',
          co_quy_trinh_vh: false,
        },
        techInfo1: {
          f_tuoi_tk: '',
          f_tuoi_tk: '',
          f_lv: '',
          wmndb: '',
          mnc: '',
          mndbt: '',
          mnltk: '',
          so_dap_phu: '',
        },
        techInfo2: {
          cao_trinh_dinh_tcs: '',
          cao_trinh_dinh_dap: '',
          h_max: '',
          length: '',
        },
        techInfo3: [],
        techInfo4: [],
      };
      this.newFeatureModalOpen = false;
    },

    editFeatureInfoModalCancel() {
      this.editFeatureInfoModalOpen = false;
    },

    editFeatureInfoModalSave() {
      if (this.selectedFeature.getId()) {
        const featureLayer = this.selectedFeature.getId().split('.')[0];
        const featureGid = this.selectedFeature.getId().split('.')[1];

        // Properties ở đây chỉ gửi thử data mẫu
        // Khi dữ liệu các layer được rõ ràng hơn thì chỉnh sửa sau
        // Dữ liệu đối tượng đã được tạo thì lấy từ database
        // Dữ liệu đối tượng mới sẽ được lấy từ featureCollections.new[i].properties
        const properties = this.selectedFeature.getProperties();

        for (let i = 0; i < this.featureCollections.modify.length; i++) {
          if (that.featureCollections.modify[i].gid === featureGid) {
            this.featureCollections.modify[i].properties = properties;
            return;
          }
        }

        this.featureCollections.modify.push({ layer: featureLayer, gid: featureGid, properties: properties });
      } else {
        const featureGid = this.selectedFeature.get('tempId');
        const properties = this.selectedFeature.getProperties();

        for (let i = 0; i < this.featureCollections.new.length; i++) {
          if (this.featureCollections.new[i].gid === featureGid) {
            this.featureCollections.new[i].properties = properties;
            this.editFeatureInfoModalOpen = false;
            return;
          }
        }
      }

      this.editFeatureInfoModalOpen = false;
    },

    editFeatureInfo() {
      this.editFeatureInfoModalOpen = true;
    },

    testClick() {
      // this.featureModify.setActive(false);
      // this.addDrawNewFeatureEvent();
      // console.log(this.layerSelected);
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

<style lang="scss"></style>
