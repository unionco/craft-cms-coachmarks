<template>
    <div>Main Menu</div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({
    name: 'main-menu',
})
export default class MainMenu extends Vue {
    mounted() {
        console.log('mainMenu mounted');
    }
}
</script>