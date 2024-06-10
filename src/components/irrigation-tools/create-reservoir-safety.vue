<template>
  <a-tooltip overlayClassName="tool-container-tooltip" :mouseEnterDelay="1" :color="tooltipBackground">
    <template #title>
      <p>Tạo báo cáo an toàn đập</p>
    </template>
    <a-button class="white-border-ant-button" :type="type" :ghost="ghost" :size="buttonSize" @click="showModal">
      <i v-if="buttonIcon" :class="buttonIcon"></i>
      <p v-if="buttonText" class="ms-2 me-2 fw-bold">
        {{ buttonText }}
      </p>
    </a-button>

    <a-modal v-model:open="modalOpen" :maskClosable="false" :closable="false">
      <template #title>
        <a-row justify="space-between" align="middle">
          <p class="fs-5">
            <span class="fs-4">
              <i class="fa-solid fa-shield-halved"></i>
            </span>
            {{ this.title }}
          </p>
          <a class="close-button me-2" @click="modalCancel"><i class="fa-solid fa-xmark"></i></a>
        </a-row>
      </template>
      <template #footer>
        <a-button key="back" @click="modalCancel">
          <span>
            <p class="me-2 ms-2">Huỷ</p>
          </span>
        </a-button>
        <a-button :loading="formSpinning" key="submit" type="primary" @click="save(false)" style="padding: 0 30px">
          <i class="fa-regular fa-floppy-disk me-1"></i>
          Lưu
        </a-button>
      </template>
      <a-spin :spinning="formSpinning">
        <a-form
          :hideRequiredMark="true"
          autocomplete="off"
          layout="vertical"
          ref="formRef"
          name="basic"
          :model="formModel"
          :rules="formRules">
          <a-form-item class="mb-4" name="id">
            <template #label>
              <p class="fw-bold">Hồ chứa:</p>
            </template>
            <a-select
              v-model:value="formModel.id"
              :options="reservoirOptions"
              :field-names="{ label: 'name', value: 'id' }"
              :loading="reservoirSelectLoading"
              :disabled="reservoirSelectLoading"
              @change="reservoirSelectChange">
            </a-select>
          </a-form-item>

          <a-form-item name="download">
            <a-checkbox v-model:checked="formModel.download">Tải xuống báo cáo sau khi lưu</a-checkbox>
          </a-form-item>

          <a-form-item name="finished">
            <a-checkbox v-model:checked="formModel.finished">Đã hoành thành báo cáo</a-checkbox>
          </a-form-item>

          <a-form-item name="name">
            <template #label>
              <p class="fw-bold">Tên báo cáo</p>
            </template>
            <a-input v-model:value="formModel.name" placeholder="Nhập tên báo cáo" />
          </a-form-item>

          <a-divider
            v-if="formModel.mainDams.length > 0"
            style="border-color: var(--primary-color)"
            orientation="left"
            orientation-margin="0px">
            Đập chính
          </a-divider>
          <a-flex v-for="(mainDam, index) in formModel.mainDams" :key="mainDam.id" vertical>
            <p class="fw-bold">Đập chính {{ mainDam.id }}</p>
            <a-form-item :name="['mainDams', index, 'status']" :rules="formRules.status">
              <a-radio-group
                v-model:value="mainDam.status"
                :options="statusOptions"
                button-style="solid"
                option-type="button">
              </a-radio-group>
            </a-form-item>
            <a-form-item :name="['mainDams', index, 'description']">
              <a-textarea
                v-model:value="mainDam.description"
                :placeholder="`Mô tả tình trạng đập chính ${mainDam.id}`"
                :rows="3" />
            </a-form-item>
          </a-flex>

          <a-divider
            v-if="formModel.subDams.length > 0"
            style="border-color: var(--primary-color)"
            orientation="left"
            orientation-margin="0px">
            Đập phụ
          </a-divider>
          <a-flex v-for="(subDam, index) in formModel.subDams" :key="subDam.id" vertical>
            <p class="fw-bold">Đập phụ {{ subDam.id }}</p>
            <a-form-item :name="['subDams', index, 'status']" :rules="formRules.status">
              <a-radio-group
                v-model:value="subDam.status"
                :options="statusOptions"
                button-style="solid"
                option-type="button">
              </a-radio-group>
            </a-form-item>
            <a-form-item :name="['subDams', index, 'description']">
              <a-textarea
                v-model:value="subDam.description"
                :placeholder="`Mô tả tình trạng đập phụ ${subDam.id}`"
                :rows="3" />
            </a-form-item>
          </a-flex>

          <a-divider
            v-if="formModel.sewers.length > 0"
            style="border-color: var(--primary-color)"
            orientation="left"
            orientation-margin="0px">
            Cống lấy nước
          </a-divider>
          <a-flex v-for="(sewer, index) in formModel.sewers" :key="sewer.id" vertical>
            <!-- <p class="fw-bold">Cống lấy nước {{ sewer.id }}</p> -->
            <p class="fw-bold">{{ sewer['name'] }}</p>
            <a-form-item :name="['sewers', index, 'status']" :rules="formRules.status">
              <a-radio-group
                v-model:value="sewer.status"
                :options="statusOptions"
                button-style="solid"
                option-type="button">
              </a-radio-group>
            </a-form-item>
            <a-form-item :name="['sewers', index, 'description']">
              <!-- <a-textarea
                v-model:value="sewer.description"
                :placeholder="`Mô tả tình trạng cống lấy nước ${sewer.id}`"
                :rows="3" /> -->
              <a-textarea
                v-model:value="sewer.description"
                :placeholder="`Mô tả tình trạng ${sewer['name']}`"
                :rows="3" />
            </a-form-item>
          </a-flex>

          <a-divider
            v-if="formModel.spillways.length > 0"
            style="border-color: var(--primary-color)"
            orientation="left"
            orientation-margin="0px">
            Tràn xả lũ
          </a-divider>
          <a-flex v-for="(spillway, index) in formModel.spillways" :key="spillway.id" vertical>
            <p class="fw-bold">Tràn xả lũ {{ spillway.id }}</p>
            <a-form-item :name="['spillways', index, 'status']" :rules="formRules.status">
              <a-radio-group
                v-model:value="spillway.status"
                :options="statusOptions"
                button-style="solid"
                option-type="button">
              </a-radio-group>
            </a-form-item>
            <a-form-item :name="['spillways', index, 'description']">
              <a-textarea
                v-model:value="spillway.description"
                :placeholder="`Mô tả tình trạng tràn xả lũ ${spillway.id}`"
                :rows="3" />
            </a-form-item>
          </a-flex>

          <a-divider
            v-if="formModel.drainages.length > 0"
            style="border-color: var(--primary-color)"
            orientation="left"
            orientation-margin="0px">
            Công trình tháo nước khác
          </a-divider>
          <a-flex v-for="(drainage, index) in formModel.drainages" :key="drainage.id" vertical>
            <p class="fw-bold">Công trình {{ drainage.id }}</p>
            <a-form-item :name="['drainages', index, 'status']" :rules="formRules.status">
              <a-radio-group
                v-model:value="drainage.status"
                :options="statusOptions"
                button-style="solid"
                option-type="button">
              </a-radio-group>
            </a-form-item>
            <a-form-item :name="['drainages', index, 'description']">
              <a-textarea
                v-model:value="drainage.description"
                :placeholder="`Mô tả tình trạng công trình ${drainage.id}`"
                :rows="3" />
            </a-form-item>
          </a-flex>

          <a-divider
            v-if="formModel.monitors.length > 0"
            style="border-color: var(--primary-color)"
            orientation="left"
            orientation-margin="0px">
            Hệ thống giám sát
          </a-divider>
          <a-flex v-for="(monitor, index) in formModel.monitors" :key="monitor.id" vertical>
            <p class="fw-bold">Hệ thống {{ monitor.id }}</p>
            <a-form-item :name="['monitors', index, 'status']" :rules="formRules.status">
              <a-radio-group
                v-model:value="monitor.status"
                :options="statusOptions"
                button-style="solid"
                option-type="button">
              </a-radio-group>
            </a-form-item>
            <a-form-item :name="['monitors', index, 'description']">
              <a-textarea
                v-model:value="monitor.description"
                :placeholder="`Mô tả tình trạng hệ thống ${monitor.id}`"
                :rows="3" />
            </a-form-item>
          </a-flex>

          <a-divider
            v-if="formModel.drainages.length > 0"
            style="border-color: var(--primary-color)"
            orientation="left"
            orientation-margin="0px">
            Tải lên hình ảnh báo cáo
          </a-divider>

          <div v-if="formModel.id" class="clearfix">
            <a-upload
              v-model:file-list="formModel.fileList"
              list-type="picture-card"
              :action="uploadTemporaryAction"
              :headers="accessHeader"
              crossOrigin="anonymous"
              :before-upload="beforeImageUpload"
              @preview="handlePreview">
              <div v-if="formModel.fileList.length < 10">
                <PlusOutlined />
                <div style="margin-top: 8px">Upload</div>
              </div>
            </a-upload>
            <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
              <img alt="An toàn đập" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form>
      </a-spin>
    </a-modal>
  </a-tooltip>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import thuyLoiApi from '@/js/axios/thuyLoiApi';
import { getItem } from '@/js/utils/localStorage';
import { downloadFile } from '@/js/utils/utils';
import { PlusOutlined } from '@ant-design/icons-vue';
import { irrigationState } from '@/stores/irrigation-state';

export default defineComponent({
  components: {
    PlusOutlined,
  },

  props: {
    title: { type: String, default: 'Báo cáo an toàn hồ chứa' },
    buttonIcon: { type: String, default: 'fa-solid fa-shield-halved' },
    buttonText: { type: String },
    buttonSize: { type: String },
    tooltipBackground: { type: String },
    type: { type: String, default: 'primary' },
    ghost: { type: Boolean },
  },

  setup() {
    const modalOpen = ref(false);
    const formRef = ref();
    const initialForm = {
      id: '',
      name: '',
      mainDams: [],
      spillways: [],
      monitors: [],
      subDams: [],
      sewers: [],
      drainages: [],
      download: false,
      finished: false,
      fileList: [],
    };
    const formModel = reactive({ ...initialForm });
    const nameValidator = async (_rule, value) => {
      const nameRegex =
        /^[a-zA-Z0-9._-àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ ]+$/;
      if (nameRegex.test(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject('Tên báo cáo không hợp lệ!');
        // }
      }
    };
    const formRules = {
      id: [
        {
          required: true,
          message: 'Chọn hồ chứa.',
          trigger: ['blur', 'change'],
        },
      ],
      status: [
        {
          required: true,
          message: 'Chọn tình trạng công trình.',
          trigger: ['blur', 'change'],
        },
      ],
      name: [
        {
          validator: nameValidator,
          trigger: ['blur', 'change'],
        },
      ],
    };
    const reservoirOptions = ref([]);

    const reservoirSelectLoading = ref(false);

    const getReservoirs = () => {
      reservoirSelectLoading.value = true;
      thuyLoiApi
        .get(`/reservoirs/index`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
        })
        .then((response) => {
          // console.log(response);
          irrigationState().setReservoirs(response.data.reservoirs);
          reservoirOptions.value = irrigationState().getReservoirs;
          reservoirSelectLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          modalOpen.value = false;
        });
    };

    getReservoirs();

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    const previewVisible = ref(false);
    const previewImage = ref('');
    const previewTitle = ref('');
    const handleCancel = () => {
      previewVisible.value = false;
      previewTitle.value = '';
    };
    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
      previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
    };

    return {
      formRef,
      modalOpen,
      initialForm,
      formModel,
      formRules,
      reservoirOptions,
      reservoirSelectLoading,
      previewVisible,
      previewImage,
      previewTitle,
      handleCancel,
      handlePreview,
    };
  },

  data() {
    return {
      formSpinning: false,
      mainDams: [],
      sewers: [],
      statusOptions: [
        {
          value: false,
          label: 'Bình thường',
        },
        {
          value: true,
          label: 'Hư hỏng',
        },
      ],
    };
  },

  computed: {
    accessHeader() {
      return { Authorization: `Bearer ${getItem('accessToken')}` };
    },

    uploadTemporaryAction() {
      return `${import.meta.env.VITE_APP_API_URL}/upload-temporary-image`;
    },
  },

  methods: {
    showModal() {
      this.modalOpen = true;
    },
    modalCancel() {
      this.modalOpen = false;

      if (this.formModel.fileList.length > 0) {
        thuyLoiApi
          .delete(`/delete-temporary-image`, {
            headers: this.accessHeader,
            data: {
              fileList: this.formModel.fileList,
            },
          })
          .then((response) => {})
          .catch((error) => {
            console.log(error);
          });
      }
    },
    save() {
      this.formRef
        .validate()
        .then((response) => {
          this.formSpinning = true;
          thuyLoiApi
            .post(`/reservoirs/${this.formModel.id}/safety-report`, this.formModel, {
              headers: this.accessHeader,
              responseType: 'arraybuffer',
            })
            .then((response) => {
              // console.log(response);
              this.$message.success('Tạo báo cáo thành công.', 3);
              if (this.formModel.download == true) {
                downloadFile(response, 'bao-cao-an-toan-dap');
              }

              Object.assign(this.formModel, this.initialForm);
              this.modalOpen = false;
              this.formSpinning = false;
            })
            .catch((error) => {
              console.log(error);
              this.formSpinning = false;
              this.$message.error('Tạo báo cáo thất bại.', 3);
            });
        })
        .catch((error) => {
          // console.log(error);
        });
    },

    formModelPushItem(array, prop) {
      this.formModel[prop] = [];
      array.forEach((item) => {
        if (item['Tên']) this.formModel[prop].push({ id: item.id, status: true, description: '', name: item['Tên'] });
        else this.formModel[prop].push({ id: item.id, status: true, description: '', name: item.id });
      });
    },

    reservoirSelectChange() {
      this.formSpinning = true;
      this.formModel.fileList = [];
      thuyLoiApi
        .get(`/reservoirs/${this.formModel.id}/info`, {
          headers: this.accessHeader,
        })
        .then((response) => {
          // console.log(response);
          this.formSpinning = false;
          const { mainDams, subDams, sewers, spillways, drainages, monitors } = response.data;

          this.mainDams = mainDams;
          this.formModelPushItem(this.mainDams, 'mainDams');
          this.spillways = spillways;
          this.formModelPushItem(this.spillways, 'spillways');
          this.monitors = monitors;
          this.formModelPushItem(this.monitors, 'monitors');

          // this.subDams = subDams;
          // this.formModelPushItem(this.subDams, 'subDams');
          // this.sewers = sewers;
          // this.formModelPushItem(this.sewers, 'sewers');

          // this.drainages = drainages;
          // this.formModelPushItem(this.drainages, 'drainages');
        })
        .catch((error) => {
          console.log(error);
          this.formSpinning = false;
          this.formModel.mainDams = [];
          this.formModel.spillways = [];
          this.formModel.monitors = [];
          // this.formModel.subDams = [];
          // this.formModel.sewers = [];
          // this.formModel.drainages = [];
        });
    },

    beforeImageUpload(file) {
      const acceptList = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
      if (acceptList.indexOf(file.type) !== -1) {
        return true;
      } else {
        this.$message.error('Ảnh không phù hợp. Vui lòng chọn ảnh khác.');
        return false;
      }
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
