<template>
    <div class="Coachmarks">
        {{ $store.isOpen ? 'Open' : 'Closed' }}
        <MainMenu v-if="$store.isOpen"/>
        <button @click="$store.toggleOpen">Click</button>
    </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
import MainMenu from './MainMenu';

@Observer
@Component({
    name: 'coachmarks',
    props: {},
    components: {
        MainMenu,
    }
})
export default class Coachmarks extends Vue {
    mounted() {
        console.log('mounted');
    }
}
</script>

<style scoped>
.Coachmarks {
    position: absolute;
    bottom: 100px;
    right: 100px;
}
</style>