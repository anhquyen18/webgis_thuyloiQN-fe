<template>
  <div>
    <a-input-search v-model:value="value" class="ms-4" placeholder="Tìm kiếm..." enter-button @search="search" />
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue';
import thuyLoiApi from '../../js/axios/thuyLoiApi.js';

export default defineComponent({
  setup() {
    const searchResult = inject('searchResult');
    const siderLayerManagerState = inject('siderLayerManagerState');

    return {
      searchResult,
      siderLayerManagerState,
    };
  },

  data() {
    return {
      value: '',
    };
  },

  computed: {},

  methods: {
    search() {
      if (!this.siderLayerManagerState.searchingTabSpinning && this.value) {
        this.siderLayerManagerState.searchingTabSpinning = true;
        this.siderLayerManagerState.activeSiderTab = 'searchingTab';
        thuyLoiApi
          .post('search-feature-name', {
            name: this.value,
          })
          .then((response) => {
            console.log(response);
            this.searchResult = response.data;
            this.siderLayerManagerState.searchingTabSpinning = false;
          })
          .catch((error) => {
            console.log(error);
            this.siderLayerManagerState.searchingTabSpinning = false;
          });
      }
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
