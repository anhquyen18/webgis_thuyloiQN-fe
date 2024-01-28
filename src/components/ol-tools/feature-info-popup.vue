<template>
  <div>
    <a-tooltip overlayClassName="tool-container-tooltip">
      <template #title>
        <p>Bật/tắt click popup</p>
      </template>
      <a-button class="white-border-ant-button" :type="buttonType" size="small" @click="statusSwitch" :ghost="status">
        <i class="fa-solid fa-window-restore"></i>
      </a-button>
    </a-tooltip>

    <div ref="olPopup" id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer fs-6"></a>
      <div id="popup-content">
        <a-card
          v-if="featurePropShow.originalLayerTitle"
          size="small"
          style="width: 320px; height: auto; position: relative"
          :bodyStyle="{ padding: 0 }"
          :headStyle="{}"
          :bordered="false">
          <!-- <template #title>
            <div class="d-flex">
              <span style="font-weight: bold" class="me-2">{{ title.replace('layer', '') }}</span>
            </div>
          </template> -->
          <!-- <template #extra>
            <a class="close-button" @click="closePopup"><i class="fa-solid fa-xmark"></i></a>
          </template> -->
          <a-row :gutter="4">
            <a-col class="p-2 ps-3" :span="13">
              <a-flex
                v-if="featurePropShow.originalLayerTitle === 'ho_chua_quang_nam_epsg5899'"
                :vertical="true"
                gap="middle">
                <p class="fw-bold">{{ featurePropShow.displayName }}</p>
                <p class="feature-info-popup--text">Mực nước hiện tại (m): 22.5</p>
                <p class="feature-info-popup--text">Dung tích hiện tại (m): 500</p>
                <a-button
                  class="feature-info-popup--text"
                  type="primary"
                  size="small"
                  style="width: 90%"
                  @click="openModal">
                  Thông tin chi tiết
                </a-button>
              </a-flex>

              <a-flex v-else :vertical="true" gap="middle">
                <p class="fw-bold">{{ featurePropShow.displayName }}</p>
                <p v-if="featurePropShow.props[2]" class="feature-info-popup--text">
                  Thông tin 1: {{ featurePropShow.props[2].value }}
                </p>
                <p v-else class="feature-info-popup--text">Thông tin 1: Không có thông tin 1</p>
                <p v-if="featurePropShow.props[13]" class="feature-info-popup--text">
                  Thông tin 2: {{ featurePropShow.props[13].value }}
                </p>
                <p v-else class="feature-info-popup--text">Thông tin 2: Không có thông tin 2</p>
                <a-button class="feature-info-popup--text" type="primary" size="small" style="width: 90%">
                  Thông tin chi tiết
                </a-button>
              </a-flex>
            </a-col>
            <a-col :span="11">
              <img
                src="../../assets/sample-image/ho-phu-ninh.jpg"
                alt=""
                style="width: 100%; height: 100%; border-radius: 0 6px 6px 0px" />
            </a-col>
          </a-row>
          <a
            class="close-button"
            @click="closePopup"
            style="position: absolute; top: 2px; right: 5px; color: aliceblue">
            <i class="fa-solid fa-xmark"></i>
          </a>
        </a-card>
      </div>
    </div>

    <a-modal class="feature-details-modal" v-model:open="modalOpen" :footer="null" :closable="false" width="800px">
      <a-spin :spinning="featureDetailsModalSpinning">
        <div style="height: 370px">
          <a-card v-if="!featureDetailsModalSpinning" :bodyStyle="{ padding: 0 }">
            <template #title>
              <a-flex justify="center">
                <span
                  v-if="
                    featurePropShow.originalLayerTitle === 'ho_chua_quang_nam_epsg5899' && !featureDataFromDB.message
                  "
                  class="me-2 fs-5">
                  Hồ {{ featureDataFromDB.generalInfo['ten'] }}
                </span>
              </a-flex>
            </template>
            <template #extra>
              <a-button
                v-if="userProfile && userProfile['department_id'] == 2"
                class="no-border-ant-button me-2"
                shape="circle"
                style="padding: 0; height: auto"
                @click="openEditModal">
                <i class="fa-regular fa-pen-to-square"></i>
              </a-button>
              <a class="close-button" @click="closeModal"><i class="fa-solid fa-xmark"></i></a>
            </template>
            <a-row v-if="!featureDataFromDB.message">
              <a-col :span="6" style="padding-top: 1px">
                <a-menu v-model:selectedKeys="menuSelectedKeys" style="border-radius: 0px 0px 0px 6px">
                  <a-menu-item key="1">Thông tin chung</a-menu-item>
                  <a-menu-item key="2">Thông tin kỹ thuật</a-menu-item>
                  <a-menu-item key="3">Hồ sơ công trình</a-menu-item>
                  <a-menu-item key="4">An toàn công trình</a-menu-item>
                  <a-menu-item key="5">Quan trắc công trình</a-menu-item>
                  <a-menu-item key="6">Quy trình vận hành</a-menu-item>
                  <a-menu-item key="7">Ngập lụt hạ du hồ chứa</a-menu-item>
                  <a-menu-item key="8">Bảo trì hồ chứa</a-menu-item>
                  <a-menu-item key="9">Hình ảnh</a-menu-item>
                  <a-menu-item key="10">Camera</a-menu-item>
                </a-menu>
              </a-col>
              <a-col class="p-2" :span="18">
                <div v-if="menuSelectedKeys[0] == 1">
                  <a-card class="detail-feature-modal-content" :bodyStyle="{ padding: '0' }" style="font-size: large">
                    <a-flex v-for="(value, key, index) in featureNameDisplay.generalInfo" class="mb-2" :vertical="true">
                      <div v-if="key === 'vi_tri'">
                        <p class="detail-feature-item--title">{{ value }}</p>
                        <p>
                          xã {{ featureDataFromDB.generalInfo['vi_tri_xa'] }}, huyện
                          {{ featureDataFromDB.generalInfo['vi_tri_huyen'] }}
                        </p>
                      </div>
                      <div v-else>
                        <p class="detail-feature-item--title">{{ value }}</p>
                        <p>{{ featureDataFromDB.generalInfo[key] }}</p>
                      </div>
                    </a-flex>
                  </a-card>
                </div>
                <div v-if="menuSelectedKeys[0] == 2">
                  <a-card class="detail-feature-modal-content" :bodyStyle="{ padding: 0 }">
                    <a-flex v-for="(value, key, index) in featureNameDisplay.techInfo1" class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">{{ value }}</p>
                      <p v-if="featureDataFromDB.techInfo1[key]">
                        {{ featureDataFromDB.techInfo1[key] }}
                      </p>
                      <p v-else="">Đang cập nhật</p>
                    </a-flex>
                    <a-flex
                      v-for="(value1, key1, index1) in featureNameDisplay.techInfo2"
                      class="mb-2"
                      :vertical="true">
                      <p class="detail-feature-item--title">{{ value1 }}</p>
                      <p v-for="(value2, key2, index2) in featureDataFromDB.techInfo2">
                        <span v-if="value2[key1]">{{ value2[key1] }}</span>
                        <span v-else>Đang cập nhật</span>
                      </p>
                    </a-flex>
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Cống lấy nước và tràn xả lũ</p>
                      <a-table
                        :columns="featureNameDisplay.techInfo3"
                        :data-source="featureDataFromDB.techInfo3"
                        :pagination="false"
                        style="font-size: 0.8rem">
                        <template #bodyCell="{ column, text }">
                          <template v-if="column.dataIndex === 'co_tran_su_co'">
                            <p v-if="text == true">Có</p>
                            <p v-else="text == true">Không</p>
                          </template>
                        </template>
                      </a-table>
                    </a-flex>
                  </a-card>
                </div>
                <div v-if="menuSelectedKeys[0] == 3">
                  <a-card class="detail-feature-modal-content" :bodyStyle="{ padding: 0 }">
                    <a-flex class="mb-2" vertical justify="flex-start">
                      <p class="detail-feature-item--title">Hồ sơ pháp lý</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Thông tin quản lý </a>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Hồ sơ pháp lý </a>
                    </a-flex>
                  </a-card>

                  <a-flex class="mb-2" :vertical="true">
                    <p class="detail-feature-item--title">Hồ sơ thiết kế</p>
                    <a> <i class="fa-solid fa-paperclip me-2"></i>Hồ sơ thiết kế công trình </a>
                  </a-flex>

                  <a-flex class="mb-2" :vertical="true">
                    <p class="detail-feature-item--title">Nhật ký vận hành</p>
                    <a> <i class="fa-solid fa-paperclip me-2"></i>Số liệu thuỷ văn </a>
                    <a> <i class="fa-solid fa-paperclip me-2"></i>Nhật ký vận hành công trình </a>
                  </a-flex>
                </div>
                <div v-if="menuSelectedKeys[0] == 4">
                  <a-card class="detail-feature-modal-content" :bodyStyle="{ padding: 0 }">
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Kê khai đăng ký an toàn đập</p>
                      <a>
                        <i class="fa-solid fa-paperclip me-2"></i>Thông tin kê khai đăng ký an toàn đạp, hồ chứa nước
                      </a>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Báo cáo an toàn công trình </a>
                    </a-flex>
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Hiện trạng an toàn đạp</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Thông tin kiểm tra an toàn đập và hồ chứa nước </a>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Báo cáo hiện trạng an toàn đập và hồ chứa nước</a>
                    </a-flex>
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Kiểm định an toàn đập</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Thông tin kết quả kiểm định an toàn đập </a>
                    </a-flex>
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Phương án bảo vệ công trình</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Thông tin phương án bảo vệ đập hồ chứa nước </a>
                      <a>
                        <i class="fa-solid fa-paperclip me-2"></i>Phương án bảo vệ thiên tai và trường hợp khẩn cấp
                      </a>
                    </a-flex>
                  </a-card>
                </div>
                <div v-if="menuSelectedKeys[0] == 5">
                  <a-card class="detail-feature-modal-content" :bodyStyle="{ padding: 0 }">
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Thông tin thiết bị quan trắc</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Thông tin thiết bị quan trắc </a>
                    </a-flex>
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Báo cáo kết quả quan trắc</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Báo cáo định kỳ </a>
                    </a-flex>
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Báo cáo sự cố</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Báo cáo sự cố </a>
                    </a-flex>
                  </a-card>
                </div>
                <div v-if="menuSelectedKeys[0] == 6">
                  <a-card class="detail-feature-modal-content" :bodyStyle="{ padding: 0 }">
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Thông tin quy trình vận hành</p>
                      <p>
                        Quy trình vận hành hồ chứa nước Phú Ninh được ban hành theo quyết định 2803/QĐ-UBND Quảng Nam,
                        ngày 12 tháng 09 năm 2013 của Uỷ ban nhân dân tỉnh Quảng Nam
                      </p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Thông tin chi tiết </a>
                    </a-flex>
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Thông tin chỉ đạo</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Thông tin chỉ đạo </a>
                    </a-flex>
                  </a-card>
                </div>
                <div v-if="menuSelectedKeys[0] == 7">
                  <a-card class="detail-feature-modal-content" :bodyStyle="{ padding: 0 }">
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title" style="background-color: transparent !important"></p>
                      <p>
                        Bản đồ ngập lụt hạ du hồ chứa nước Phú Ninh được ban hành kèm theo quyết định số ...... ngày
                        .../.../... của Uỷ ban Nhân dân tỉnh Quảng Nam. Bản đồ ngập lụt hạ du theo các kịch bản lũ thiết
                        kế, lũ kiểm tra và kịch bản vỡ hồ:
                      </p>
                      <p>- Kịch bản lũ thiết kế: <a style="text-decoration: underline"> Xem tại đây </a></p>
                      <p>- Kịch bản lũ kiểm tra: <a style="text-decoration: underline"> Xem tại đây </a></p>
                      <p>- Kịch bản vỡ hồ: <a style="text-decoration: underline"> Xem tại đây </a></p>
                    </a-flex>
                  </a-card>
                </div>
                <div v-if="menuSelectedKeys[0] == 8">
                  <a-card class="detail-feature-modal-content" :bodyStyle="{ padding: 0 }">
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Danh mục, kế hoạch bảo trì</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Bảo trì </a>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Sửa chữa thường xuyên </a>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Sửa chữa khẩn cấp </a>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Nâng cấp </a>
                    </a-flex>
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Khối lượng thực hiện</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Chi tiết </a>
                    </a-flex>
                    <a-flex class="mb-2" :vertical="true">
                      <p class="detail-feature-item--title">Kinh phí thực hiện</p>
                      <a> <i class="fa-solid fa-paperclip me-2"></i>Chi tiết </a>
                    </a-flex>
                  </a-card>
                </div>
                <div v-if="menuSelectedKeys[0] == 9" style="width: auto">
                  <a-carousel arrows>
                    <template #prevArrow>
                      <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                        <LeftCircleOutlined />
                      </div>
                    </template>
                    <template #nextArrow>
                      <div class="custom-slick-arrow" style="right: 10px">
                        <RightCircleOutlined />
                      </div>
                    </template>
                    <div><img src="../../assets/sample-image/0-1.jpg" alt="" style="width: 100%; height: 405px" /></div>
                    <div>
                      <img
                        src="../../assets/sample-image/12032019vthuy13.jpg"
                        alt=""
                        style="width: 100%; height: 405px" />
                    </div>
                    <div>
                      <img
                        src="../../assets/sample-image/ho-phu-ninh-1_1632822386.jpg"
                        alt=""
                        style="width: 100%; height: 405px" />
                    </div>
                    <div>
                      <img
                        src="../../assets/sample-image/ho-phu-ninh-quang-nam-banner.jpg"
                        alt=""
                        style="width: 100%; height: 405px" />
                    </div>

                    <div>
                      <img src="../../assets/sample-image/ho-phu-ninh.jpg" alt="" style="width: 100%; height: 405px" />
                    </div>
                  </a-carousel>
                </div>
                <div v-if="menuSelectedKeys[0] == 10">
                  <a-carousel arrows style="color: white">
                    <template #prevArrow>
                      <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                        <LeftCircleOutlined />
                      </div>
                    </template>
                    <template #nextArrow>
                      <div class="custom-slick-arrow" style="right: 10px">
                        <RightCircleOutlined />
                      </div>
                    </template>
                    <div><h3>Camera 1</h3></div>
                    <div><h3>Camera 2</h3></div>
                    <div><h3>Camera 3</h3></div>
                    <div><h3>Camera 4</h3></div>
                  </a-carousel>
                </div>
              </a-col>
            </a-row>
            <div v-else style="height: 250px">
              {{ featureDataFromDB.message }}
            </div>
          </a-card>
        </div>
      </a-spin>
    </a-modal>

    <a-modal v-model:open="editModalOpen" :maskClosable="false">
      <template #closeIcon>
        <a class="close-button" @click="closeEditModal"><i class="fa-solid fa-xmark"></i></a>
      </template>
      <template #title>
        <span>
          <i class="fa-regular fa-pen-to-square fs-4"></i>
        </span>
        <span class="fs-6"> Chỉnh sửa thông tin Hồ {{ featureDataFromDB.generalInfo['ten'] }} </span>
      </template>
      <template #footer>
        <a-button key="back" @click="editCancel">Huỷ</a-button>

        <a-popconfirm
          title="Bạn có muốn lưu thay đổi?"
          ok-text="Có"
          cancel-text="Không"
          @confirm="saveEditConfirm"
          @cancel="saveEditCancel">
          <a-button key="submit" type="primary" :loading="editModalSpinning" @click="editSave" style="padding: 0 30px">
            Lưu
          </a-button>
        </a-popconfirm>
      </template>
      <a-spin :spinning="editModalSpinning">
        <a-card style="height: 405px; overflow: auto">
          <a-flex v-for="(value, key, index) in featureNameDisplay.generalInfo" class="mb-2" :vertical="true">
            <div v-if="key === 'vi_tri'">
              <p class="detail-feature-item--title">{{ value }}</p>
              <div style="display: flex">
                <p>xã</p>
                <a-input
                  v-model:value="temporaryEditData.generalInfo['vi_tri_xa']"
                  size="small"
                  style="font-size: 0.8rem; width: 150px; margin-left: 5px" />
                <p>, huyện</p>
                <a-input
                  v-model:value="temporaryEditData.generalInfo['vi_tri_huyen']"
                  size="small"
                  style="font-size: 0.8rem; width: 150px; margin-left: 5px" />
              </div>
            </div>

            <div v-else-if="key === 'co_quy_trinh_vh'">
              <p class="detail-feature-item--title">{{ value }}</p>
              <a-checkbox v-model:checked="temporaryEditData.generalInfo[key]">Có hoặc không</a-checkbox>
            </div>

            <div v-else>
              <p class="detail-feature-item--title">{{ value }}</p>
              <a-input v-model:value="temporaryEditData.generalInfo[key]" size="small" />
            </div>
          </a-flex>
          <a-flex v-for="(value, key, index) in featureNameDisplay.techInfo1" class="mb-2" :vertical="true">
            <p class="detail-feature-item--title">{{ value }}</p>
            <a-input v-model:value="temporaryEditData.techInfo1[key]" size="small" />
          </a-flex>
          <a-flex v-for="(value1, key1, index1) in featureNameDisplay.techInfo2" class="mb-2" :vertical="true">
            <p class="detail-feature-item--title">{{ value1 }}</p>
            <p v-for="(value2, key2, index2) in temporaryEditData.techInfo2">
              <a-input v-model:value="value2[key1]" size="small" style="font-size: 0.8rem" />
            </p>
          </a-flex>
          <a-flex class="mb-2" :vertical="true">
            <p class="detail-feature-item--title">Cống lấy nước và tràn xả lũ</p>
            <a-table
              :columns="featureNameDisplay.techInfo3"
              :data-source="temporaryEditData.techInfo3"
              :pagination="false"
              style="font-size: 0.8rem">
              <template #bodyCell="{ column, text, record, index }">
                <!-- <template v-if="column.dataIndex === 'co_tran_su_co'">
                  <p v-if="text == true">Có</p>
                  <p v-else="text == true">Không</p>
                </template> -->
                <!-- <div> -->
                <template v-if="column.dataIndex === 'co_tran_su_co'">
                  <a-checkbox v-model:checked="temporaryEditData.techInfo3[index][column.dataIndex]"></a-checkbox>
                </template>

                <template v-else>
                  <a-input
                    v-model:value="temporaryEditData.techInfo3[index][column.dataIndex]"
                    size="small"
                    style="font-size: 0.8rem" />
                </template>
                <!-- <a-input
                  
            v-model:value="temporaryEditData[column]"
            style="margin: -5px 0"
          /> -->

                <!-- </div> -->
              </template>
            </a-table>
          </a-flex>
        </a-card>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, inject, ref } from 'vue';
import { userState } from '@/stores/user-state';
import { mapState } from '../../stores/map-state';
import * as VueLayer from '../../js/openlayers/VueLayer.js';

import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import { Feature, Observable, Overlay } from 'ol';
import { Style, Stroke, Circle, Fill } from 'ol/style.js';
import thuyLoiApi from '../../js/axios/thuyLoiApi.js';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    LeftCircleOutlined,
    RightCircleOutlined,
  },
  setup() {
    const featurePropShow = inject('featurePropShow');
    const userProfile = inject('userProfile');
    return {
      featurePropShow,
      userProfile,
    };
  },

  data() {
    return {
      modalOpen: false,
      editModalOpen: false,
      menuSelectedKeys: ['1'],
      buttonType: 'primary',
      status: false,
      featureDataFromDB: { generalInfo: { ten: '' } },
      featureDetailsModalSpinning: false,
      currentFeature: '',
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
          f_tuoi_tk: 'Diện tích tưới thật tế (ha)',
          f_lv: 'Diện tích lưu vực (km2)',
          wmndb: 'W mndbt (10^6 m3)',
          mnc: 'Mực nước chết (m)',
          mndbt: 'Mực nước dâng bình thường (m)',
          mnltk: 'Mực nước lũ thiết kế (m)',
          so_dap_phu: 'Số đập phụ',
          cao_trinh_dinh_tcs: 'Cao trình đỉnh tường chắn sóng (m)',
        },
        techInfo2: {
          cao_trinh_dinh_dap: 'Cao trình đỉnh đập (m)',
          H_max: 'H max (m)',
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
          {
            title: 'Cao trình ngưỡng tràn (m)',
            dataIndex: 'cao_trinh_nguong_tran',
          },
          {
            title: 'B tràn (m)',
            dataIndex: 'B_tran',
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

      editModalSpinning: false,
      temporaryEditData: '',
      // popup------------------------------------------------------
      featureProps: [{ rows: ['loading', 'loading...'] }],
      // feature
      highlightLabelStyles: {
        MultiLineString: new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 4,
          }),
        }),
        LineString: new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 4,
          }),
        }),
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
        MultiPolygon: new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(243, 138, 138, 0.5)',
          }),
        }),
        Polygon: new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 3,
          }),
          fill: new Fill({
            color: 'rgba(243, 138, 138, 0.5)',
          }),
        }),
        Circle: new Style({
          stroke: new Stroke({
            color: 'cyan',
            width: 1,
          }),
          fill: new Fill({
            color: 'rgba(243, 138, 138, 0.5)',
          }),
        }),
      },
    };
  },

  computed: {
    map() {
      return mapState().getMap;
    },

    loginState: function () {
      return userState().getLogin;
    },
  },

  watch: {
    map: {
      handler() {
        this.addClick();
      },
      deep: false,
    },
  },

  methods: {
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

    stylePopup(feature) {
      return this.highlightLabelStyles[feature.getGeometry().getType()];
    },

    addClick() {
      let closer = document.getElementById('popup-closer');
      let highlightLayer = new VectorLayer({
        title: 'Feature highlight layer',
        source: new VectorSource({}),
        style: this.stylePopup,
      });
      highlightLayer.setVisible(false);
      const overlay = new Overlay({
        title: 'Feature infomation overlay',
        id: 'featurePopupOverlay',
        element: document.getElementById('popup'),
        // autoPan: {
        //   animation: {
        //     duration: 250,
        //   },
        // },
      });

      closer.onclick = function () {
        highlightLayer.getSource().clear();
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      this.map.addOverlay(overlay);

      this.map.addLayer(highlightLayer);

      let that = this;

      this.showPopupKey = this.map.on('singleclick', function (evt) {
        that.featureProps = [];
        if (!that.$refs.olPopup.classList.contains('ol-popup__active') && that.status) {
          that.$refs.olPopup.classList.add('ol-popup__active');
        }

        highlightLayer.getSource().clear();
        evt.target.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
          if (layer && that.status) {
            let featureProp = {};
            featureProp.title = layer.get('title');
            featureProp.rows = [];
            featureProp.id = feature.getId();
            featureProp.geom = '';

            let props = feature.getProperties();
            if (feature.getId()) {
              switch (featureProp.id.split('.')[0]) {
                case 'ho_chua_quang_nam_epsg5899':
                  featureProp.name = props.name;
                  featureProp.displayName = 'Hồ ' + featureProp.name;
                  break;
                case 'cuaxa':
                  featureProp.name = props.ten;
                  featureProp.displayName = 'Đập ' + featureProp.name;
                  break;
                case 'kenh':
                  featureProp.name = featureProp.id.split('.')[1];
                  featureProp.displayName = 'Kênh ' + featureProp.name;
                  break;
                default:
                  featureProp.displayName = 'Chỉnh tên ở map click';
              }
            }

            // Đang sử dụng mảng để triển khai cái props của feature
            // Khi có được tất cả các layer chính thức
            // và có thông tin cần hiển thị cho tất cả thì lúc đó dùng json
            Object.keys(props).forEach((x, i, arr) => {
              if (x != 'geometry' && x != 'HinhAnh') {
                featureProp.rows.push({
                  // key: i + 1,
                  name: x,
                  value: props[x],
                });
              } else if (x == 'geometry') {
                featureProp.geom = props[x];
              }
            });
            // featureProp.rows = props;

            if (featureProp.rows.length) {
              that.featureProps.push(featureProp);
            }
          }
        });

        if (that.featureProps.length) {
          that.featurePropShow.originalLayerTitle = that.featureProps[0].id.split('.')[0];
          that.featurePropShow.props = that.featureProps[0].rows;
          that.featurePropShow.displayName = that.featureProps[0].displayName;
          that.featurePropShow.originalName = that.featureProps[0].name;
          that.featurePropShow.id = that.featureProps[0].id.split('.')[1];

          // console.log(that.featurePropShow);
          let feature = new Feature({
            geometry: that.featureProps[0].geom,
          });

          highlightLayer.getSource().addFeature(feature);

          const coordinate = evt.coordinate;

          overlay.setPosition(coordinate);
        } else {
          overlay.setPosition(undefined);
          that.featurePropShow.originalLayerTitle = null;
        }
      });
    },

    closePopup() {
      this.$refs.olPopup.classList.remove('ol-popup__active');
      VueLayer.getLayerByTitle(this.map, 'Feature highlight layer').getSource().clear();
    },

    closeModal() {
      this.modalOpen = false;
    },

    closeEditModal() {
      this.editModalOpen = false;
    },

    openModal() {
      this.modalOpen = true;
      // console.log(this.featureProps[0]);
      // if (this.status && this.currentFeature != this.featureProps[0].id) {
      // console.log(this.featurePropShow);
      this.featureDetailsModalSpinning = true;
      // let name = '';
      // if (this.featureProps[0].id.split('.')[0] === 'ho_chua_quang_nam_epsg5899')
      //   name = this.featurePropShow.props[2].value;
      // console.log(this.featurePropShow.originalLayerTitle, this.featurePropShow.id, this.featurePropShow.originalName);
      thuyLoiApi
        .post('/get-feature-info', {
          layer: this.featurePropShow.originalLayerTitle,
          id: this.featurePropShow.id,
          name: this.featurePropShow.originalName,
        })
        .then((response) => {
          // console.log(response);
          if (response.data) {
            this.featureDataFromDB = response.data;
            this.featureDetailsModalSpinning = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.featureDetailsModalSpinning = false;
        });
    },

    openEditModal() {
      this.editModalOpen = true;
      this.temporaryEditData = JSON.parse(JSON.stringify(this.featureDataFromDB));
    },

    editCancel() {
      this.editModalOpen = false;
    },

    editSave() {
      // console.log(this.temporaryEditData);
    },

    saveEditConfirm() {
      this.editModalOpen = false;
      this.featureDataFromDB = this.temporaryEditData;
    },

    saveEditCancel() {},
  },
  mounted() {},
});
</script>

<style lang="scss">
.ol-popup {
  background: transparent;
  position: absolute;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  // border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  display: none;
  // min-width: 280px;
}
.ol-popup__active {
  display: block;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
// .ol-popup:after {
//   border-top-color: white;
//   border-width: 10px;
//   left: 48px;
//   margin-left: -10px;
// }
// .ol-popup:before {
//   border-top-color: #cccccc;
//   border-width: 11px;
//   left: 48px;
//   margin-left: -11px;
// }

.feature-details-modal .ant-modal-content {
  padding: 0 !important;
}

.detail-feature-modal-content {
  // background-color: red;
  border-radius: 0 !important;
  height: 100%;
  overflow-y: auto;
  max-height: 405px;
  border: none;

  // height: 380px;
}

.detail-feature-item--title {
  background-color: var(--primary-color) !important;
  padding: 5px 10px;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  line-height: normal !important;
  font-size: 0.8rem;

  // hạ font-size cùng hàng
  & ~ div,
  ~ a,
  ~ p,
  ~ input,
  ~ label {
    font-size: 0.8rem;
    padding-left: 5px;
    margin-top: 5px;

    & p {
      font-size: 0.8rem;
    }
  }
  & ~ a {
    text-decoration: underline;
  }
}

.slick-slide {
  text-align: center;
  // height: 360px;
  line-height: 405px;
  background: #364d79;
  overflow: hidden;
}

.slick-arrow.custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}
.slick-arrow.custom-slick-arrow:before {
  display: none;
}
.slick-arrow.custom-slick-arrow:hover {
  color: #fff;
  opacity: 0.5;
}

.feature-info-popup--text {
  font-size: 0.8rem;
}
</style>
