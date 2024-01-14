<template>
  <div>
    <a-card
      :active-tab-key="activeSiderTab"
      :bodyStyle="{ padding: 0, backgroundColor: '#ffffff !important' }"
      style="border: none"
      :headStyle="{ borderRadius: '0.5rem' }">
      <div v-if="activeSiderTab === 'layersTab'">
        <!-- <a-menu class="layers-visible-menu" mode="inline" style="border: none">
          <a-sub-menu key="sub1">
            <template #title>
              <a-row>
                <icon>
                  <template #component>
                    <img
                      src="../../assets/icon/lake.png"
                      alt=""
                      style="height: 1.5rem; width: 1.5rem"
                    />
                  </template>
                </icon>
                <span>Hồ chứa</span>
              </a-row>
            </template>
            <a-sub-menu>
              <template #title>
                <span>Hồ chứa lớn</span>
              </template>
              <a-menu-item key="1" style="padding: 0">
                <span style="text-wrap: wrap"> test </span>
              </a-menu-item>
            </a-sub-menu>
          </a-sub-menu>
        </a-menu> -->
        <a-collapse v-model:activeKey="activeKey" ghost>
          <a-collapse-panel key="1" header="Hồ chứa">
            <template #extra>
              <icon>
                <template #component>
                  <img src="../../assets/icon/lake.png" alt="" style="height: 1rem; width: 1rem" />
                </template>
              </icon>
            </template>
            <a-collapse default-active-key="4" ghost>
              <template #expandIcon="{ isActive }">
                <CaretRightOutlined :rotate="isActive ? 90 : 0" />
              </template>
              <a-collapse-panel key="1" header="Hồ chứa lớn">
                <p>a1</p>
              </a-collapse-panel>
              <a-collapse-panel key="2" header="Hồ chứa vừa">
                <p>a1</p>
              </a-collapse-panel>
              <a-collapse-panel key="3" header="Hồ chứa nhỏ">
                <p>a1</p>
              </a-collapse-panel>
            </a-collapse>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="This is panel header 2">
            <p>Đang cập nhật</p>
          </a-collapse-panel>
        </a-collapse>
      </div>

      <div v-if="activeSiderTab === 'searchingTab'">kết quả tìm kiếm</div>
    </a-card>
  </div>
</template>

<script>
import { defineComponent, ref, inject } from 'vue';
import Icon, { CaretRightOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    Icon,
    CaretRightOutlined,
  },
  setup() {
    const tabList = [
      {
        key: 'layersTab',
        tab: 'Layers',
      },
      {
        key: 'searchingTab',
        tab: 'Searching',
      },
    ];
    const activeSiderTab = inject('activeSiderTab');
    const onTabChange = (value) => {
      key.value = value;
    };

    return {
      tabList,
      activeSiderTab,
      onTabChange,
    };
  },
  data() {
    return {
      activeKey: ['1'],
    };
  },
  computed: {
    map() {
      return mapState().getMap;
    },
  },
  methods: {},
  mounted() {},
});
</script>

<style lang="scss">
.layers-visible-menu .ant-menu-item {
  padding-left: 2rem !important;
}
.icon {
  background: url('luffy-chilling-gear5-round.png');
  height: 20px;
  width: 20px;
  display: block;
  /* Other styles here */
}
</style>
