import VueMaterial from 'vue-material';
import UiStore from './store/UiStore';
import Coachmarks from './components/Coachmarks';
import ContentStore from './store/ContentStore';
// import NavigationService from './services/NavigationService';
import 'vue-material/dist/vue-material.min.css';

const globalContainer = document.querySelector('#global-container');
const vueRoot = document.createElement('div');
globalContainer.appendChild(vueRoot);

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.prototype.$cmUiStore = new UiStore();
  window.Vue.prototype.$cmContentStore = new ContentStore();
  window.Vue.use(VueMaterial);

//   const navService = new NavigationService(window.Vue);
//   window.Vue.prototype.$nav = navService;

  if (vueRoot) {
    new window.Vue({
      render: h => h(Coachmarks)
    }).$mount(vueRoot);
  }
}
