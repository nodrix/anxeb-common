<div class="box btn box-radius-3x text-info-hover text-left w-full" style="border-radius: 6px; cursor: pointer" v-on:click="action()">
  <div class="pull-left m-r" style="padding-top: 4px">
    <i class="fa text-4x m-y-sm" :style="{color:color}" style="position: relative;top:-1px" :class="icon"></i>
  </div>
  <div class="clear m-y-sm">
    <div class="text-muted text-md-right" style="border-bottom: solid 1px #c0c0c0; padding-bottom: 5px; padding-top: 4px">${label}</div>
    <div v-if="value != null && value.toString().length > 0" class="text-lg-right _600 text-2x">
      <span class="text-muted" style="font-weight: 100; font-size: 0.8em;  position: relative; top:-2px">${prefix}&nbsp;</span><span :style="{color:color}">${value}</span>
    </div>
    <div v-else class="text-lg-right _600 text-2x text-danger" style="font-weight: 100">
      <i class="fa fa-exclamation-circle" style="font-size: 0.9em"></i></div>
  </div>
</div>
