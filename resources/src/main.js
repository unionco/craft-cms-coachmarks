import VueMaterial from 'vue-material';
import Coachmarks from './components/Coachmarks';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import RootStore from './store';

const globalContainer = document.querySelector('#global-container');
const vueRoot = document.createElement('div');
globalContainer.appendChild(vueRoot);

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.prototype.$store = new RootStore();
  window.Vue.use(VueMaterial);

  if (vueRoot) {
    new window.Vue({
      render: h => h(Coachmarks),
    }).$mount(vueRoot);
  }

  document.querySelector('html').classList.remove('md-theme-default');
}
