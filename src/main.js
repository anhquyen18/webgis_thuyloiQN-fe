import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
import {
  Button,
  message,
  Row,
  Col,
  Layout,
  ConfigProvider,
  Input,
  Card,
  Menu,
  Collapse,
  Slider,
  Divider,
  Tooltip,
  Popover,
} from 'ant-design-vue';
import App from './App.vue';
import axios from 'axios';
// import Cesium as Cesium from '../node_modules/cesium/Build/Cesium/Cesium.js';
// window.Cesium = Cesium;
window.axios = axios;

import '../node_modules/bootstrap/dist/css/bootstrap-grid.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap-utilities.min.css';
// import '../node_modules/chart.js/dist/chart.umd.js';
import '../node_modules/dayjs/dayjs.min.js';
import '../node_modules/ol/dist/ol.js';
import '../node_modules/ol/ol.css';
// import '../node_modules/cesium/Build/Cesium/Cesium.js';
// import '../node_modules/ol-ext/dist/ol-ext.js';
// import '../node_modules/ol-ext/dist/ol-ext.css';

const app = createApp(App);
app.config.productionTip = false;
app.use(createPinia());
app.use(router);

app.use(Button);
app.use(Layout);
app.use(Row);
app.use(Col);
app.use(ConfigProvider);
app.use(Input);
app.use(Card);
app.use(Menu);
app.use(Collapse);
app.use(Slider);
app.use(Divider);
app.use(Tooltip);
app.use(Popover);

app.mount('#app');

app.config.globalProperties.$message = message;
