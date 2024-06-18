import { App } from "vue";
import ArcoDesign from "@arco-design/web-vue";

export function setupUIPlugin(app: App<Element>) {
  app.use(ArcoDesign);
}
