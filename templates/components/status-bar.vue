<div class="app-box-shadow">
<div class="text-xs p-2">
  <div class="pull-right" :class="{'text-muted': options == null || options.muted !== false}">
    <span v-if="$slots.caption !== null"><slot name="caption"></slot></span>
    <span class="hidden-xs-down" v-if="$slots.build !== null">&nbsp;-&nbsp;<slot name="build"></slot></span>
  </div>
  <div v-if="hint != null" class="nav" v-html="hint"></div>
  <div v-else-if="$slots.state != null" class="nav">
    <slot name="state"></slot>
  </div>
</div>
</div>