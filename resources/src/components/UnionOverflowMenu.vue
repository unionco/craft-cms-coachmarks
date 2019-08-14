<script>
import { CvOverflowMenu } from '@carbon/vue/src';
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';

@Component({
  extends: CvOverflowMenu,
})
export default class UnionOverflowMenu extends Vue {
  @Emit('openChanged')
  @Watch('open')
  onOpenChanged(val, oldVal) {
    return {
      open: val,
    };
  }
}
</script>
