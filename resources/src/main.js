// import 'carbon-components/css/carbon-components.css';
// import CarbonComponentsVue from '@carbon/vue/src/index';
import UiStore from './store/UiStore';
import Coachmarks from './components/Coachmarks';
import ContentStore from './store/ContentStore';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
// import '@mdi/font/css/materialdesignicons.css';
const globalContainer = document.querySelector('#global-container');
const vueRoot = document.createElement('div');
globalContainer.appendChild(vueRoot);

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.prototype.$cmUiStore = new UiStore();
  window.Vue.prototype.$cmContentStore = new ContentStore();
  //   window.Vue.use(CarbonComponentsVue);
  window.Vue.use(VueMaterial);
  if (vueRoot) {
    new window.Vue({
      render: h => h(Coachmarks)
    }).$mount(vueRoot);
  }
}
