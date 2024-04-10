<template>
  <a-popover trigger="click" placement="topRight">
    <a-button tpye="primary" shape="circle" ghost>
      <i class="fa-solid fa-file-signature"></i>
    </a-button>

    <template #content>
      <a-row justify="between" style="width: 8vw">
        <a-col :span="8">
          <a-button type="primary">
            <i class="fa-solid fa-shield-halved"></i>
          </a-button>
        </a-col>
        <a-col :span="8">
          <a-button type="primary">
            <i class="fa-solid fa-hammer"></i>
          </a-button>
        </a-col>
        <a-col :span="8">
          <a-button type="primary">
            <i class="fa-solid fa-tags"></i>
          </a-button>
        </a-col>
      </a-row>
    </template>
  </a-popover>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {},
});
</script>

<style lang="scss"></style>
