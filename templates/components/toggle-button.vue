<div class="app-toggle-button" v-on:click="toggle">
  <div class="_container" :class="{'_active' : state === true}" :style="{width: width || size, height:height || size}">
    <div class="_center">
      <div class="_icon">
        <i class="fa" :class="icon"></i>
      </div>
      <div class="_label" v-if="label != null">
        ${label}
      </div>
    </div>
  </div>
</div>