<template>
  <div>
    <a-button
      :disabled="buttonDisabled"
      :type="buttonType"
      :ghost="buttonGhost"
      :size="buttonSize"
      :buttonShape="buttonShape"
      @click="showModal">
      <slot name="buttonContent"></slot>
    </a-button>

    <a-modal v-model:open="open" :bodyStyle="{ paddingLeft: '10px' }" :width="width">
      <template #title>
        <a-row class="ps-2" justify="middle">
          <a-col :span="2">
            <a-typography-text class="fs-4" type="warning"> <ExclamationCircleOutlined /> </a-typography-text>
          </a-col>
          <a-col>
            <p class="fs-6">
              {{ title }}
            </p>
          </a-col>
        </a-row>
      </template>
      <a-row class="mb-3" justify="middle">
        <a-col :span="2"> </a-col>
        <a-col>
          <a-typography-text type="danger">
            {{ description }}
          </a-typography-text>
        </a-col>
      </a-row>

      <template #footer>
        <a-button type="default" @click="closeModal">
          <span>
            <p class="me-2 ms-2">Huỷ</p>
          </span>
        </a-button>
        <a-button type="primary">
          <span>
            <p class="me-2 ms-2" @click="modalConfirm">Xác nhận</p>
          </span>
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    ExclamationCircleOutlined,
  },

  props: {
    buttonType: { type: String, default: 'default' },
    buttonSize: { type: String },
    buttonShape: { type: String },
    buttonGhost: { type: Boolean, default: false },
    buttonDisabled: { type: Boolean, default: false },
    confirm: Function,
    width: { type: Number, default: 420 },
    title: { type: String },
    description: { type: String },
    descriptionType: { type: String, default: 'danger' },
  },
  setup() {
    return {};
  },

  data() {
    return {
      open: false,
    };
  },

  computed: {},

  methods: {
    showModal() {
      this.open = true;
    },

    closeModal() {
      this.open = false;
    },

    modalConfirm() {
      this.closeModal();
      this.confirm();
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
