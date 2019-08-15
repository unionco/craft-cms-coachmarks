<template>
    <div>
        <div class="Coachmarks">
            <!-- {{ $store.isOpen ? 'Open' : 'Closed' }} -->
            <Toggle/>
            <Router/>
            <!-- <button @click="$store.toggleOpen">Click</button> -->
        </div>
        <!-- <div class="Coachmarks--debug">
            <pre>
                {{ $cmContentStore.debug }}
            </pre>
        </div> -->
    </div>
</template>

<script>
import { Component, Vue, Provide } from 'vue-property-decorator';
import { Observer } from 'mobx-vue';
// import MainMenu from './MainMenu';
import Toggle from './Toggle.vue';
import Router from './Router.vue';

@Observer
@Component({
    name: 'coachmarks',
    props: {},
    components: {
        // MainMenu,
        Router,
        Toggle
    }
})
export default class Coachmarks extends Vue {
    mounted() {
        console.log('mounted');
        if (this.$cmContentStore.coachmarksState === 'uninitialized') {
            this.$cmContentStore.fetchCoachmarks();
        }
    }

    @Provide()
    getCoachmark(id) {
        return this.$cmContentStore.coachmarks.find(c => c.id === id);
    }
}
</script>
