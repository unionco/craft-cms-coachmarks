<template>
    <div>
        <div class="Coachmarks">
            <!-- {{ $store.isOpen ? 'Open' : 'Closed' }} -->
            <MainMenu/>
            <!-- <button @click="$store.toggleOpen">Click</button> -->
        </div>
        <div class="Coachmarks--debug">
            <pre>
                {{ $cmContentStore.debug }}
            </pre>
        </div>
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
        this.$cmContentStore.fetchCoachmarks();
    }
}
</script>

<style scoped>
.Coachmarks {
    position: absolute;
    bottom: 50px;
    right: 50px;
}
.Coachmarks--debug {
    position: absolute;
    top: 50px;
    right: 150px;
}
</style>
