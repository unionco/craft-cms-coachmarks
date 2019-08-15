<script>
import { Vue } from 'vue-property-decorator';
import { toJS, autorun } from 'mobx';
import { Observer } from 'mobx-vue';

@Observer
export default class NavigationService extends Vue {
    Vue = undefined;
    constructor(Vue) {
        this.Vue = Vue;
        this.writeCookie = this.writeCookie.bind(this);

        autorun(() => {
            const data = this.Vue.$cmUiStore.serialize();
            console.log('nav', data);
        })
    }

    writeCookie() {
        const ui = this.Vue.$cmUiStore;
        const uiState = {
            open: toJS(ui.open),
        }
    }
}
</script>