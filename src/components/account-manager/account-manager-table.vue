<template>
  <a-table
    class="account-manager-table"
    rowKey="id"
    :row-selection="{ selectedRowKeys: policyTableState.selectedRowKeys, onChange: onPolicySelectChange }"
    :columns="policyColumns"
    :data-source="policyDataSource"
    :loading="policyTableSpinning"
    :bordered="false"
    :showSorterTooltip="false"
    :expand-column-width="100"
    :scroll="{ x: true }">
    <template #title>
      <a-row>
        <a-col flex="1 1 300px">
          <p class="fs-5 fw-bold">
            Gán quyền hạn - <i>Tuỳ chọn</i>
            <span v-if="this.policyOriginDataSource" style="color: lightgray">
              ({{ this.policyOriginDataSource.length }})</span
            >
          </p>
        </a-col>
        <a-col flex="">
          <a-flex gap="middle">
            <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadPolicyTable">
              <i class="fa-solid fa-rotate-right"></i>
            </a-button>
          </a-flex>
        </a-col>
      </a-row>
      <a-row>
        <a-col class="mt-1" :xs="24"></a-col>
        <a-col :xs="24" :md="16">
          <a-input v-model:value="policySearchValue" class="mt-2" placeholder="Tìm kiếm" @change="policySearchChange">
            <template #prefix>
              <i class="fa-solid fa-magnifying-glass me-2"></i>
            </template>
          </a-input>
        </a-col>
      </a-row>
    </template>

    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'name'">
        <a-button class="no-border-ant-button" ghost>
          <u style="text-underline-offset: 3px">
            {{ record.name }}
          </u>
        </a-button>
      </template>

      <template v-else-if="column.key === 'created'">
        <span>{{ myGetLastTime(record.created_at) }}</span>
      </template>
    </template>
  </a-table>
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
