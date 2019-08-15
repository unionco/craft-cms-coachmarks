
<template>
    <div>
        <template v-slot:toolbar>
            Toolbar
        </template>
        <template v-slot:content>
            Content
        </template>
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import BaseDetail from './BaseDetail.vue';

@Observer
@Component({
    extends: BaseDetail,
})
export default class StepDetail extends Vue {

}
</script>