import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
import {
  Button,
  message,
  Row,
  Col,
  Layout,
  Flex,
  ConfigProvider,
  Input,
  Card,
  Menu,
  Collapse,
  Slider,
  Divider,
  Tooltip,
  Popover,
  Modal,
  Select,
  Switch,
  Spin,
  Table,
  Carousel,
  Form,
  Checkbox,
  Popconfirm,
} from 'ant-design-vue';
import App from './App.vue';
import axios from 'axios';
window.axios = axios;

import '../node_modules/bootstrap/dist/css/bootstrap-grid.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap-utilities.min.css';
import '../node_modules/ol/ol.css';
import '../node_modules/ol-ext/dist/ol-ext.css';
import '../node_modules/jsts/dist/jsts.min.js';

const app = createApp(App);
app.config.productionTip = false;
app.use(createPinia());
app.use(router);

app.use(Button);
app.use(Row);
app.use(Col);
app.use(Layout);
app.use(Flex);
app.use(ConfigProvider);
app.use(Input);
app.use(Card);
app.use(Menu);
app.use(Collapse);
app.use(Slider);
app.use(Divider);
app.use(Tooltip);
app.use(Popover);
app.use(Modal);
app.use(Select);
app.use(Switch);
app.use(Spin);
app.use(Table);
app.use(Carousel);
app.use(Form);
app.use(Checkbox);
app.use(Popconfirm);

app.mount('#app');

app.config.globalProperties.$message = message;
