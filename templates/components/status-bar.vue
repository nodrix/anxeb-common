<div class="app-box-shadow">
<div class="text-xs p-2">
  <div class="pull-right" :class="{'text-muted': options == null || options.muted !== false}">
    <span v-if="$slots.caption !== null"><slot name="caption"></slot></span>
    <span class="hidden-xs-down" v-if="$slots.build !== null">&nbsp;-&nbsp;<slot name="build"></slot></span>
  </div>
  <div class="nav" v-html="finalHint">
  </div>
</div>
</div>