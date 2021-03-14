<div ref="box" v-show="context != null && positionStyle != null" class="app-context-menu" :style="positionStyle">
  <div class="_actions">
    <div class="dropdown-menu">
      <div class="_container" v-if="context != null">
        <div v-for="item in context.actions" v-disabled="item.isDisabled != null && item.isDisabled() === true">
          <div class="_divisor" v-if="item.divider"></div>
          <a class="_label" :class="item.class" v-on:click.stop="execute(item)">
            <i v-if="item.icon != null" class="_icon fa" :class="item.icon"></i> ${item.caption}
          </a>
        </div>
      </div>
    </div>
  </div>
</div>