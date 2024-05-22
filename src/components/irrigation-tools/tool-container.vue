<template>
  <a-popover trigger="focus" placement="topRight">
    <a-button tpye="primary" shape="circle" ghost>
      <i class="fa-solid fa-file-signature"></i>
    </a-button>

    <template #content>
      <a-row justify="between" style="width: 8vw">
        <a-col :span="8">
          <ReservoirSafety :tooltipBackground="tooltipBackground"></ReservoirSafety>
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
import { defineComponent, provide } from 'vue';
import ReservoirSafety from '@/components/irrigation-tools/reservoir-safety.vue';

export default defineComponent({
  components: {
    ReservoirSafety,
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
