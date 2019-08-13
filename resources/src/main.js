import Store from './store/store';
import Coachmarks from './components/Coachmarks';

console.log('hello from coachmarks');

const globalContainer = document.querySelector('#global-container');
const vueRoot = document.createElement('div');
globalContainer.appendChild(vueRoot);

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.prototype.$store = new Store();

    if (vueRoot) {
        new window.Vue({
            render: h => h(Coachmarks),
        }).$mount(vueRoot);
    }
}
