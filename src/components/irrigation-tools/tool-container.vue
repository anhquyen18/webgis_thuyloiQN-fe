<template>
  <a-popover trigger="focus" placement="topRight">
    <a-button type="default" shape="circle" ghost>
      <i class="fa-solid fa-file-signature"></i>
    </a-button>

    <template #content>
      <a-row justify="between" style="width: 8vw">
        <a-col v-if="safety" :span="8">
          <CreateReservoirSafety :tooltipBackground="tooltipBackground"></CreateReservoirSafety>
        </a-col>
        <a-col v-if="maintain" :span="8">
          <a-button type="primary">
            <i class="fa-solid fa-hammer"></i>
          </a-button>
        </a-col>
        <a-col v-if="operation" :span="8">
          <a-button type="primary">
            <i class="fa-solid fa-tags"></i>
          </a-button>
        </a-col>
      </a-row>
    </template>
  </a-popover>
</template>

<script>
import { defineComponent, provide } from 'vue';
import CreateReservoirSafety from '@/components/irrigation-tools/create-reservoir-safety.vue';

export default defineComponent({
  components: {
    CreateReservoirSafety,
  },

  props: {
    safety: { type: Boolean, required: true },
    operation: { type: Boolean, required: true },
    maintain: { type: Boolean, required: true },
  },

  setup() {
    // const buttonSize = ref('medium');
    return {};
  },

  data() {
    return {
      tooltipBackground: 'geekblue',
    };
  },

  computed: {},

  methods: {},

  mounted() {},
});
</script>

<style lang="scss"></style>
