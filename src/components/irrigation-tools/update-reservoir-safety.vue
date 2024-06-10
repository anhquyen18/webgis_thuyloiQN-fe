<template>
  <a-button :class="buttonClass" :type="type" :ghost="ghost" :size="buttonSize" @click="showModal">
    <slot name="text"> </slot>
  </a-button>

  <a-modal v-model:open="modalOpen" :maskClosable="false" :closable="false">
    <template #title>
      <a-row justify="space-between" align="top">
        <a-col :span="23">
          <p class="fs-5">
            <span class="fs-4">
              <i class="fa-solid fa-shield-halved"></i>
            </span>
            {{ this.title }}
          </p>
        </a-col>
        <a-col :span="1">
          <a class="close-button me-2" @click="modalCancel"><i class="fa-solid fa-xmark"></i></a>
        </a-col>
      </a-row>
    </template>
    <template #footer>
      <a-button key="back" @click="modalCancel">
        <span>
          <p class="me-2 ms-2">Huỷ</p>
        </span>
      </a-button>
      <a-button :loading="formSpinning" key="submit" type="primary" @click="save">
        <span>
          <p class="me-2 ms-2">Lưu thay đổi</p>
        </span>
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
            <p class="fw-bold">Tên báo cáo:</p>
          </template>
          <p>{{ reportName }}</p>
        </a-form-item>
        <a-form-item name="finished">
          <a-checkbox v-model:checked="formModel.finished">Đã hoành thành báo cáo</a-checkbox>
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
            >
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
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';
import thuyLoiApi from '@/js/axios/thuyLoiApi';
import { getItem } from '@/js/utils/localStorage';
import { downloadFile } from '@/js/utils/utils';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  components: {
    PlusOutlined,
  },

  props: {
    title: { type: String, default: 'Chỉnh sửa ' },
    report: { type: Object, required: true },
    buttonIcon: { type: String, default: 'fa-solid fa-shield-halved' },
    buttonText: { type: String },
    buttonClass: { type: String },
    buttonSize: { type: String },
    tooltipBackground: { type: String },
    type: { type: String, default: 'primary' },
    ghost: { type: Boolean },
    reportName: { type: String, required: true },
  },

  setup(props) {
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
      finished: false,
      fileList: [],
    };

    const formModel = reactive(JSON.parse(JSON.stringify(initialForm)));
    const formRules = {
      status: [
        {
          required: true,
          message: 'Chọn tình trạng công trình.',
          trigger: ['blur', 'change'],
        },
      ],
    };

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

    const fillForm = () => {
      const {
        id,
        name,
        finished_status,
        main_dam_status,
        main_dam_description,
        spillway_status,
        spillway_description,
        monitor_system_status,
        monitor_system_description,
      } = props.report;
      formModel.id = id;
      formModel.name = name;
      formModel.finished = finished_status;
      formModel.mainDams.push({ name: 1, id: 1, status: main_dam_status, description: main_dam_description });
      formModel.spillways.push({ name: 1, id: 1, status: spillway_status, description: spillway_description });
      formModel.monitors.push({
        name: 1,
        id: 1,
        status: monitor_system_status,
        description: monitor_system_description,
      });
    };
    fillForm();

    return {
      formRef,
      modalOpen,
      initialForm,
      // ...toRefs(formModel),
      formModel,
      formRules,
      previewVisible,
      previewImage,
      previewTitle,
      handleCancel,
      handlePreview,
      fillForm,
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

      // Tạm thời chưa tham chiếu thêm các công trình phụ
      // Chỉ lấy thông tin report
      // Nên id của các công trình phụ sẽ được giả lập là 1
      // console.log(this.report);

      // console.log(this.formModel);
    },

    modalCancel() {
      this.modalOpen = false;
      Object.assign(this.formModel, this.initialForm);
      // console.log(this.initialForm);
      // this.formModel.mainDams = [];
      // this.formModel.spillways = [];
      // this.formModel.monitors = [];
      this.fillForm();

      // if (this.formModel.fileList.length > 0) {
      //   thuyLoiApi
      //     .delete(`/delete-temporary-image`, {
      //       headers: {
      //         Authorization: `Bearer ${getItem('accessToken')}`,
      //       },
      //       data: {
      //         fileList: this.formModel.fileList,
      //       },
      //     })
      //     .then((response) => {})
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // }
    },
    save() {
      console.log(this.formModel);

      // this.title = 'anhquyen111';
      // this.formRef
      //   .validate()
      //   .then((response) => {
      //     this.formSpinning = true;
      //     thuyLoiApi
      //       .post(`/reservoirs/${this.formModel.id}/safety-report`, this.formModel, {
      //         headers: {
      //           Authorization: `Bearer ${getItem('accessToken')}`,
      //         },
      //         // responseType: 'arraybuffer',
      //       })
      //       .then((response) => {
      //         console.log(response);
      //         this.$message.success('Tạo báo cáo thành công.', 3);
      //         if (this.formModel.download == true) {
      //           downloadFile(response, 'bao-cao-an-toan-dap');
      //         }
      //         Object.assign(this.formModel, this.initialForm);
      //         this.modalOpen = false;
      //         this.formSpinning = false;
      //       })
      //       .catch((error) => {
      //         console.log(error);
      //         this.formSpinning = false;
      //         this.$message.error('Tạo báo cáo thất bại.', 3);
      //       });
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    },

    formModelPushItem(array, prop) {
      this.formModel[prop] = [];
      array.forEach((item) => {
        if (item['Tên']) this.formModel[prop].push({ id: item.id, status: true, description: '', name: item['Tên'] });
        else this.formModel[prop].push({ id: item.id, status: true, description: '', name: item.id });
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
