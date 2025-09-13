import type { App } from "vue"
import Antd, { ConfigProvider } from 'ant-design-vue';
export default function InstallAnt(app: App) {
  app.use(Antd);
  app.component("ConfigProvider", ConfigProvider);
}
