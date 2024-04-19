<template>
  <div>
    <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
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
        :bodyStyle="{ padding: '5px', width: '170px', maxHeight: '150px', overflow: 'hidden' }">
        <template #extra>
          <a class="close-button" @click="closeModifyPanel"><i class="fa-solid fa-xmark"></i></a>
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
          <a-config-provider
            :theme="{
              token: {
                colorPrimary: '#00c3c3',
              },
            }">
            <a-col :span="6">
              <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
                <template #title>
                  <p>Lưu thay đổi</p>
                </template>
                <a-button type="primary" size="small" ghost :disabled="saveStatus" @click="save">
                  <i class="fa-solid fa-file-export"></i>
                </a-button>
              </a-tooltip>
            </a-col>
            <a-col>
              <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
                <template #title>
                  <p>Thêm đối tượng</p>
                </template>
                <a-button type="primary" size="small" :ghost="!newFeatureDrawStatus" @click="toggleNewFeatureDraw">
                  <i class="fa-solid fa-plus"></i>
                </a-button>
              </a-tooltip>
            </a-col>
            <a-col>
              <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
                <template #title>
                  <p>Điều chỉnh đối tượng</p>
                </template>
                <a-button type="primary" size="small" :ghost="!modifyStatus" @click="toggleModify">
                  <i class="fa-solid fa-bezier-curve"></i>
                </a-button>
              </a-tooltip>
            </a-col>
            <a-col>
              <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
                <template #title>
                  <p>Chọn đối tượng</p>
                </template>
                <a-button type="primary" size="small" :ghost="!selectStatus" @click="toggleSelect">
                  <i class="fa-solid fa-hand-pointer"></i>
                </a-button>
              </a-tooltip>
            </a-col>
          </a-config-provider>
        </a-row>
        <a-row class="mt-1" align="middle" justify="space-around">
          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
              <template #title>
                <p>Ghép đối tượng</p>
              </template>
              <a-button
                type="primary"
                size="small"
                :ghost="true"
                :disabled="!modifyStatus"
                @click="mergeSelectedPolygons">
                <i class="fa-regular fa-clone"></i>
              </a-button>
            </a-tooltip>
          </a-col>

          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
              <template #title>
                <p>Cắt đối tượng</p>
              </template>
              <a-button
                type="primary"
                size="small"
                :ghost="!splitDraw"
                :disabled="!modifyStatus"
                @click="toggleSplitDraw">
                <i class="fa-solid fa-scissors"></i>
              </a-button>
            </a-tooltip>
          </a-col>

          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
              <template #title>
                <p>Thuộc tính đối tượng</p>
              </template>
              <a-button type="primary" size="small" ghost :disabled="!selectedFeature" @click="editFeatureInfo">
                <i class="fa-solid fa-list-ul"></i>
              </a-button>
            </a-tooltip>
          </a-col>

          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
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
        </a-row>

        <!-- <a-row class="mt-1" align="middle" justify="space-around">
          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Xoá đối tượng</p>
              </template>
              <a-button type="primary" size="small" ghost danger @click="testClick"> Tét 1 </a-button>
            </a-tooltip>
          </a-col>

          <a-col>
            <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1">
              <template #title>
                <p>Xoá đối tượng</p>
              </template>
              <a-button type="primary" size="small" ghost danger @click="testClick"> Tét 2 </a-button>
            </a-tooltip>
          </a-col>
        </a-row> -->
      </a-card>
    </div>

    <div id="remove-point-overlay">
      <!-- <i class="fa-solid fa-xmark"></i>
      xoá đỉnh -->
      <a-button
        ref="removeVertexButton"
        id="removeVertextButton"
        type="primary"
        size="small"
        ghost
        danger
        @click="removePoint">
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

    <a-modal v-model:open="removeConfirmModalOpen" :maskClosable="false" :closable="false" width="25%">
      <template #title>
        <a-row>
          <a-col :span="2">
            <ExclamationCircleOutlined class="fs-4 me-2 text-warning"></ExclamationCircleOutlined>
          </a-col>

          <span class="fs-6"> Bạn có chắc muốn xoá đối tượng này? </span>
        </a-row>
      </template>
      <template #footer>
        <a-button key="back" @click="removeConfirmModalCancel">Huỷ</a-button>

        <a-button key="submit" type="primary" @click="removeConfirmModalSave" style="padding: 0 30px"> Lưu </a-button>
      </template>
      <a-row>
        <a-col :span="2"> </a-col>

        <span class="text-danger">Những dữ liệu được thay đổi sẽ không thể trở lại.</span>
      </a-row>
    </a-modal>

    <a-modal v-model:open="saveModalOpen" :maskClosable="false" :closable="false" width="25%">
      <template #title>
        <a-row>
          <a-col :span="2">
            <ExclamationCircleOutlined class="fs-4 me-2 text-warning"></ExclamationCircleOutlined>
          </a-col>

          <span class="fs-6"> Bạn có chắc muốn muốn lưu những thay đổi? </span>
        </a-row>
      </template>
      <template #footer>
        <a-button key="back" @click="saveModalCancel">Huỷ</a-button>

        <a-button key="submit" type="primary" @click="saveModalSave" :loading="saveLoading" style="padding: 0 30px">
          Lưu
        </a-button>
      </template>
      <a-row>
        <a-col :span="2"> </a-col>
        <span class="text-danger">Những dữ liệu được thay đổi sẽ không thể trở lại.</span>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, inject, ref } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { mapState } from '@/stores/map-state';
import * as VueLayer from '@/js/openlayers/VueLayer.js';
import thuyLoiApi from '@/js/axios/thuyLoiApi.js';
import { getItem, setItem, removeItem } from '@/js/utils/localStorage.js';

import { WKB } from 'ol/format';
import Overlay from 'ol/Overlay.js';
import { Select, Modify, Draw, Translate, Snap } from 'ol/interaction';
import { Style, Stroke, Circle, Fill } from 'ol/style.js';
import ol_interaction_ModifyTouch from 'ol-ext/interaction/ModifyTouch.js';
import {
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  GeometryCollection,
  LinearRing,
} from 'ol/geom.js';
import { Feature } from 'ol';
import { altKeyOnly } from 'ol/events/condition';

import * as turf from '@turf/turf';

export default defineComponent({
  components: {
    ExclamationCircleOutlined,
  },

  setup() {
    const buttonSize = inject('buttonSize');
    const cancelSave = ref('');
    const tooltipBackground = inject('tooltipBackground');

    return {
      buttonSize,
      cancelSave,
      tooltipBackground,
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
      },
      vertexSelected: null,
      saveStatus: true,
      newFeatureDraw: null,
      newFeatureDrawStatus: false,
      newFeatureModalOpen: false,
      newFeatureSelectedKeys: [1],
      removeConfirmModalOpen: false,
      saveModalOpen: false,
      saveLoading: false,
      selectStatus: false,
      selectedFeature: null,

      editFeatureInfoModalOpen: false,
      editFeatureInfoSelectedKeys: [1],

      splitDraw: null,

      modifySnap: null,

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

      vertexStyle: new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({
            color: '#f5425a',
          }),
        }),
        geometry: function (feature) {
          const type = feature.getGeometry().getType();
          if (type == 'MultiPolygon') {
            const multiCoordinates = feature.getGeometry().getCoordinates();
            let totalPoint = [];
            multiCoordinates.forEach((coordinates) => {
              for (var i = 0; i < coordinates.length; i++) {
                totalPoint = [...totalPoint, ...coordinates[i]];
              }
            });

            return new MultiPoint(totalPoint);
          } else {
            const coordinates = feature.getGeometry().getCoordinates()[0];
            return new MultiPoint(coordinates);
          }
        },
      }),

      // vertexLineStyle: new Style({
      //   image: new Circle({
      //     radius: 3,
      //     fill: new Fill({
      //       color: '#f5425a',
      //     }),
      //   }),
      //   geometry: function (feature) {
      //     const coordinates = feature.getGeometry().getCoordinates()[0];
      //     return new MultiPoint(coordinates);
      //   },
      // }),

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
          this.vertexStyle,
        ],
        LineString: [
          new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 2,
            }),
          }),
          this.vertexStyle,
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
          this.vertexStyle,
        ],
        Polygon: [
          new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 3,
            }),
            fill: new Fill({
              // color: 'rgba(0, 0, 255, 0.1)',
              color: 'red',
            }),
          }),
          this.vertexStyle,
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
        // multi: true,
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
        const type = e.feature.getGeometry().getType();
        if (type == 'Point') return;
        removePointOverlay.setPosition(removePointCoordinate);
      });
      modify.on('hidepopup', function (e) {
        removePointOverlay.setPosition(undefined);
      });

      return modify;
    },
    featureModifyDrag() {
      const translate = new Translate({
        condition: (e) => {
          return altKeyOnly(e);
        },

        features: this.featureModifySelect.getFeatures(),
      });

      return translate;
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
    layerSourceSelected() {
      return VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource();
    },
    wkbFormat() {
      return new WKB({
        geometryLayout: 'XYZM',
      });
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
    openModifyPanel() {
      if (!this.buttonStatus) {
        this.controlPanelDisplay = 'block';
        this.buttonStatus = true;
        this.buttonType = 'default';
      } else {
        this.closeModifyPanel();
      }
    },

    closeModifyPanel() {
      this.controlPanelDisplay = 'none';
      this.buttonStatus = false;
      this.buttonType = 'primary';
      this.changeModifyStatus(false);
      this.stopNewFeatureDraw();
      this.changeSelectStatus(false);
      this.stopSplitDraw();
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
      this.stopSplitDraw();
    },

    save() {
      this.saveModalOpen = true;
    },

    saveModalCancel() {
      this.saveModalOpen = false;
      this.cancelUpdateFeatureInfo.cancel('Cập nhật feature không thành công');
    },

    saveModalSave() {
      this.cancelUpdateFeatureInfo = axios.CancelToken.source();
      this.saveLoading = true;
      thuyLoiApi
        .put('/update-feature-geom', this.featureCollections, {
          cancelToken: this.cancelUpdateFeatureInfo.token,
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
        })
        .then((response) => {
          console.log(response);
          this.featureCollections = {
            new: [],
            modify: [],
            remove: [],
          };
          VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource().refresh();

          this.$message.success(response.data.message, 3);
          this.saveLoading = false;
          this.saveModalOpen = false;
        })
        .catch((error) => {
          console.log(error);
          if (error.code == 'ERR_CANCELED') {
            this.$message.error(error.message, 3);
          } else {
            this.$message.error(error.response.data.message, 3);
          }
          this.saveModalOpen = false;
        });
    },

    // --------------------------------------------------------------------------------------
    // Modify ----------------------------------------------------------------------
    // --------------------------------------------------------------------------------------
    addModifiedFeature(feature) {
      if (feature.getId()) {
        const featureLayer = feature.getId().split('.')[0];
        const featureGid = feature.getId().split('.')[1];

        const featureGeometry = feature.getGeometry();
        const geom = this.wkbFormat.writeGeometry(featureGeometry);

        for (let i = 0; i < this.featureCollections.modify.length; i++) {
          if (this.featureCollections.modify[i].gid === featureGid) {
            this.featureCollections.modify[i].geom = geom;
            // console.log(this.featureCollections.modify);
            return;
          }
        }
        this.featureCollections.modify.push({ layer: featureLayer, gid: featureGid, geom: geom, properties: null });
      } else if (!feature.getId()) {
        const featureGid = feature.get('tempId');
        const featureGeometry = feature.getGeometry();
        const geom = this.wkbFormat.writeGeometry(featureGeometry);

        for (let i = 0; i < this.featureCollections.new.length; i++) {
          if (this.featureCollections.new[i].gid === featureGid) {
            this.featureCollections.new[i].geom = geom;
            return;
          }
        }
      }
    },
    addModifyEvent() {
      let that = this;
      this.map.addInteraction(this.featureModifySelect);
      this.map.addInteraction(this.featureModify);
      this.map.addInteraction(this.featureModifyDrag);

      this.featureModify.on('modifystart', (e) => {
        // Chạy thử có phải cái này sẽ cho ra geom trước khi thay đổi không
        // Đã thử và có khác
        // Khi start ta sẽ có geom của feature trước khi được modify
        // console.log(e.features.getArray()[0].getGeometry().getCoordinates());
      });

      this.featureModify.on('modifyend', (e) => {
        const features = e.features.getArray();
        if (features) {
          features.forEach((feature) => {
            this.addModifiedFeature(feature);
          });
        }
      });

      this.featureModifyDrag.on('translateend', (e) => {
        const features = e.features.getArray();
        if (features) {
          features.forEach((feature) => {
            this.addModifiedFeature(feature);
          });
        }
      });
    },

    changeModifyStatus(boolean) {
      this.modifyStatus = boolean;
      this.featureModifySelect.setActive(this.modifyStatus);
      this.featureModify.setActive(this.modifyStatus);
      this.featureModifySelect.getFeatures().clear();
      if (boolean) {
        this.modifySnap = new Snap({
          source: VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource(),
        });
        this.map.addInteraction(this.modifySnap);
      } else {
        this.map.removeInteraction(this.modifySnap);
        this.modifySnap = null;
      }
    },

    toggleModify() {
      if (!this.layerSelected) return;
      this.stopNewFeatureDraw();
      this.stopSplitDraw();
      this.changeSelectStatus(false);
      this.changeModifyStatus(!this.modifyStatus);
    },

    removePoint() {
      this.featureModify.removePoint();
    },

    addNewFeature(oldFeature, newFeature, geometry) {
      this.layerSourceSelected.addFeature(newFeature);
      const properties = oldFeature.getProperties();
      delete properties['geometry'];
      newFeature.setProperties(properties);
      const wkb = this.wkbFormat.writeGeometry(geometry);
      const tempId = Math.floor(Math.random() * 1000) + 1;
      newFeature.set('tempId', tempId);
      this.featureCollections.new.push({
        layer: this.layerSelected,
        gid: tempId,
        geom: wkb,
        properties: newFeature.getProperties(),
      });
    },

    startSplitDraw() {
      let that = this;
      const feature = this.featureModifySelect.getFeatures().getArray()[0];
      // console.log(target.length);
      if (!feature) {
        return;
      }
      let parser = new jsts.io.OL3Parser();
      parser.inject(
        Point,
        LineString,
        LinearRing,
        Polygon,
        MultiPoint,
        MultiLineString,
        MultiPolygon,
        GeometryCollection,
      );
      // Hiện tại chỉ cho cắt Polygon và MyltiPolygon có 1 Polygon, còn MultiPolygon thật chưa cho
      if (parser.read(feature.getGeometry())._geometries.length > 1) return;

      let layerSource = VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource();
      let type = feature.getGeometry().getType();
      this.splitDraw = new Draw({
        type: 'LineString',
        maxPoints: 2,
      });

      const stop = () => {
        this.removeFeature(feature);
        this.stopSplitDraw();
        this.featureModifySelect.getFeatures().clear();
        this.featureModifySelect.setActive(true);
        this.featureModify.setActive(true);
      };

      // Chỉ cho cắt thành 2, với một đường cắt thành nhiều mảnh hơn không cho
      if (type == 'MultiPolygon_Test') {
        // Chấp nhận chỉ cho cắt polygon
        // Hiện tại muốn cắt polygon thì các polygon trong multi phải được rã ra theo

        // if (type == 'MultiPolygon') target = parser.read(feature.getGeometry())._geometries;
        // else target = parser.read(feature.getGeometry());
        // parser;
        const geometries = parser.read(feature.getGeometry())._geometries;
        let target = [];
        let holes = [];
        // parser.read(.forEach((geom, index) => {
        //   console.log(index);
        //   target.push(geom.getExteriorRing());
        //   holes = [...holes, ...geom._holes];
        // });
        for (let i = 0; i < geometries.length; i++) {
          // target.push(geometries[i]);
          target.push(geometries[i].getExteriorRing());
          // console.log(geometries[0].getExteriorRing().geometries[i].getExteriorRing());
          // console.log();
          holes = [...holes, ...geometries[i]._holes];
          // result = target.union(geometries[i].getExteriorRing());
        }
        // console.log(geometries);
        // console.log(result);

        // let holes = target._holes;
        this.splitDraw.on('drawend', (e) => {
          let splitLine = parser.read(e.feature.getGeometry());
          // let union = target.union(splitLine);
          // let union = result.union(splitLine);
          let polygonizer = new jsts.operation.polygonize.Polygonizer();
          target.forEach((element) => {
            // console.log(element.union(splitLine));
            polygonizer.add(element.union(splitLine));
          });

          // polygonizer.add(union);
          let polygons = polygonizer.getPolygons();
          console.log(polygons);
          // if (polygons.array.length === 1) {
          //   polygons.array.forEach((geom) => {
          //     holes.forEach((hole) => {
          //       let arr = [];
          //       for (let i in hole.getCoordinates()) {
          //         arr.push([hole.getCoordinates()[i].x, hole.getCoordinates()[i].y]);
          //       }

          //       hole = parser.read(new Polygon([arr]));
          //       geom = geom.difference(hole);
          //     });

          //     let splittedPolygon = new Feature({
          //       // geometry: new Polygon(parser.write(geom).getCoordinates()),
          //       geometry: new MultiPolygon([parser.write(geom).getCoordinates()]),
          //     });
          //     layerSource.addFeature(splittedPolygon);
          //   });
          //   stop();
          // }
        });
      } else if (type == 'Polygon' || type == 'MultiPolygon') {
        let target;
        if (type == 'MultiPolygon') target = parser.read(feature.getGeometry())._geometries[0];
        else target = parser.read(feature.getGeometry());
        // let target = parser.read(feature.getGeometry());

        let holes = target._holes;
        this.splitDraw.on('drawend', (e) => {
          let splitLine = parser.read(e.feature.getGeometry());
          let union = target.getExteriorRing().union(splitLine);
          let polygonizer = new jsts.operation.polygonize.Polygonizer();
          polygonizer.add(union);
          let polygons = polygonizer.getPolygons();

          if (polygons.array.length == 2) {
            polygons.array.forEach((geom) => {
              holes.forEach((hole) => {
                let arr = [];
                for (let i in hole.getCoordinates()) {
                  arr.push([hole.getCoordinates()[i].x, hole.getCoordinates()[i].y]);
                }

                hole = parser.read(new Polygon([arr]));
                geom = geom.difference(hole);
              });

              let geometry;
              if (type == 'MultiPolygon') geometry = new MultiPolygon([parser.write(geom).getCoordinates()]);
              else geometry = new Polygon(parser.write(geom).getCoordinates());

              let splittedPolygon = new Feature({
                geometry: geometry,
              });

              this.addNewFeature(feature, splittedPolygon, geometry);
            });
            stop();
            console.log(this.featureCollections);
          }
        });
      } else if (type == 'MultiLineString' || type == 'LineString') {
        let target;
        if (type == 'MultiLineString') target = turf.lineString(feature.getGeometry().getCoordinates()[0]);
        else target = turf.lineString(feature.getGeometry().getCoordinates());
        this.splitDraw.on('drawend', (e) => {
          // console.log(feature.getId());
          // feature.setId(105);
          // console.log(feature.getId());

          let splitLine = turf.lineString(e.feature.getGeometry().getCoordinates());
          let lines = turf.lineSplit(target, splitLine);

          if (lines.features.length == 2) {
            lines.features.forEach((element) => {
              let geometry;
              if (type == 'MultiLineString') geometry = new MultiLineString(element.geometry.coordinates);
              else geometry = new LineString(element.geometry.coordinates);
              let splittedLineString = new Feature({
                geometry: geometry,
              });

              this.addNewFeature(feature, splittedLineString, geometry);
            });
            stop();
            console.log(this.featureCollections);
          }
        });
      }

      this.map.addInteraction(this.splitDraw);
      this.featureModifySelect.setActive(false);
      this.featureModify.setActive(false);
    },

    stopSplitDraw() {
      this.map.removeInteraction(this.splitDraw);
      this.splitDraw = null;
    },

    toggleSplitDraw() {
      if (this.splitDraw) {
        this.stopSplitDraw();
        this.featureModifySelect.setActive(true);
        this.featureModify.setActive(true);
      } else {
        this.startSplitDraw();
      }
    },

    uncap(str) {
      return str.charAt(0).toLowerCase() + str.slice(1);
    },

    mergeSelectedPolygons() {
      let layerSource = VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource();
      let type = layerSource.getFeatures()[0].getGeometry().getType();
      let uncapType = this.uncap(type);

      if (type === 'MultiPolygon' || type === 'Polygon') {
        if (this.featureModifySelect.getFeatures().getArray().length > 1) {
          let polygons = this.featureModifySelect.getFeatures().getArray();
          let target = turf[uncapType](polygons[0].getGeometry().getCoordinates());
          let mergeCount = [polygons[0]];

          for (let i = 1; i < polygons.length; i++) {
            let selected = turf[uncapType](polygons[i].getGeometry().getCoordinates());
            let result = turf.intersect(target, selected);
            if (result) {
              target = turf.union(target, selected);
              mergeCount.push(polygons[i]);
            }
          }

          if (mergeCount.length > 1) {
            let geometry;
            if (type == 'MultiPolygon') {
              // Kiểm tra Multi chỉ có một polygon và Multi có nhiều polygon
              // Type trên là của feature còn type dưới này là của feature mới sau khi union

              if (target.geometry.type == 'MultiPolygon') {
                geometry = new MultiPolygon(target.geometry.coordinates);
              } else {
                geometry = new MultiPolygon([target.geometry.coordinates]);
              }
            } else geometry = new Polygon(target.geometry.coordinates);
            const feature = new Feature({
              geometry: geometry,
            });

            this.addNewFeature(polygons[0], feature, geometry);

            mergeCount.forEach((element) => {
              this.removeFeature(element);
            });

            console.log(this.featureCollections);
          }
        }
      }
    },

    // --------------------------------------------------------------------------------------
    // Add new feature ----------------------------------------------------------------------
    // --------------------------------------------------------------------------------------

    addFeatureSelectEvent() {
      // Nhớ làm multi select
      this.map.addInteraction(this.featureSelect);

      this.featureSelect.on('select', (e) => {
        const feature = e.selected[0];

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
      this.modifySnap = new Snap({
        source: VueLayer.getLayerByDbName(this.map, this.layerSelected, 1).getSource(),
      });

      this.newFeatureDraw = new Draw({
        source: source,
        type: type,
      });

      this.newFeatureDraw.on('drawend', (e) => {
        const feature = e.feature;
        const featureGeometry = feature.getGeometry();
        const geom = this.wkbFormat.writeGeometry(featureGeometry);
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
      this.map.addInteraction(this.modifySnap);
      this.newFeatureDrawStatus = true;
    },

    stopNewFeatureDraw() {
      this.map.removeInteraction(this.newFeatureDraw);

      // Dùng compute không xoá kiểu này được, dùng data và set value mới được
      this.map.removeInteraction(this.modifySnap);
      this.modifySnap = null;
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

    // --------------------------------------------------------------------------------------
    // Select feature ----------------------------------------------------------------------
    // --------------------------------------------------------------------------------------

    changeSelectStatus(boolean) {
      this.selectStatus = boolean;
      this.featureSelect.setActive(this.selectStatus);
      this.featureSelect.getFeatures().clear();
      this.selectedFeature = null;
    },

    toggleSelect() {
      if (!this.layerSelected) return;
      this.changeSelectStatus(!this.selectStatus);
      this.changeModifyStatus(false);
      this.stopNewFeatureDraw();
    },

    removeFeature(feature) {
      if (feature.getId()) {
        const featureLayer = feature.getId().split('.')[0];
        const featureGid = feature.getId().split('.')[1];
        this.featureCollections.modify = this.featureCollections.modify.filter((item) => item.gid != featureGid);
        this.featureCollections.remove.push({ layer: featureLayer, gid: featureGid });
      } else {
        const gid = feature.get('tempId');
        this.featureCollections.new = this.featureCollections.new.filter((item) => item.gid != gid);
      }
      this.layerSourceSelected.removeFeature(feature);
    },

    removeSelectedFeature() {
      this.removeConfirmModalOpen = true;
    },

    removeConfirmModalCancel() {
      this.removeConfirmModalOpen = false;
    },

    removeConfirmModalSave() {
      if (this.selectedFeature) {
        // console.log(this.selectedFeature);
        this.featureSelect
          .getFeatures()
          .getArray()
          .forEach((feature) => {
            this.removeFeature(feature);
          });

        this.selectedFeature = null;
        this.removeConfirmModalOpen = false;
      }
    },

    editFeatureInfoModalCancel() {
      this.editFeatureInfoModalOpen = false;
    },

    editFeatureInfoModalSave() {
      // if (this.selectedFeature.getId()) {
      //   const featureLayer = this.selectedFeature.getId().split('.')[0];
      //   const featureGid = this.selectedFeature.getId().split('.')[1];
      //   // Properties ở đây chỉ gửi thử data mẫu
      //   // Khi dữ liệu các layer được rõ ràng hơn thì chỉnh sửa sau
      //   // Dữ liệu đối tượng đã được tạo thì lấy từ database
      //   // Dữ liệu đối tượng mới sẽ được lấy từ featureCollections.new[i].properties
      //   const properties = this.selectedFeature.getProperties();
      //   for (let i = 0; i < this.featureCollections.modify.length; i++) {
      //     if (that.featureCollections.modify[i].gid === featureGid) {
      //       this.featureCollections.modify[i].properties = properties;
      //       return;
      //     }
      //   }
      //   this.featureCollections.modify.push({
      //     layer: featureLayer,
      //     gid: featureGid,
      //     geom: null,
      //     properties: properties,
      //   });
      // } else {
      //   const featureGid = this.selectedFeature.get('tempId');
      //   const properties = this.selectedFeature.getProperties();
      //   for (let i = 0; i < this.featureCollections.new.length; i++) {
      //     if (this.featureCollections.new[i].gid === featureGid) {
      //       this.featureCollections.new[i].properties = properties;
      //       this.editFeatureInfoModalOpen = false;
      //       return;
      //     }
      //   }
      // }
      // this.editFeatureInfoModalOpen = false;
    },

    editFeatureInfo() {
      this.editFeatureInfoModalOpen = true;
    },

    testClick() {
      // console.log(this.featureModifySelect.getFeatures().getArray()[0].getGeometry().getCoordinates());
      // console.log(this.title);
      // this.featureModify.setActive(true);
    },
    testClick2() {},
  },

  mounted() {
    const container = document.getElementById('map-container');
    container.appendChild(this.$refs.controlPanel);
    // this.removePoint();
  },
});
</script>

<style lang="scss"></style>
