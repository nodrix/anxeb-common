<div>
  <div v-on:click="navigate" class="app-tenant-list-item b-l b-l-4x " :class="{'app-tenant-list-item-selected' : active}">
    <div class="list-item no-border ng-scope">
      <div class="list-left app-list-item-icon">
        <div class="pull-right text-xs _notification" v-if="notifications != null && notifications > 0">
          <span class="label rounded danger">${notifications}</span>
        </div>
        <div class="pull-right text-xs _alert" v-if="alert != null && alert.visible !== false">
          <div class="label rounded" :style="{'background-color' : alert.color}"><i class="fa" :class="alert.icon"></i>
          </div>
        </div>
        <div class="fa" :class="[icon]"></div>
      </div>
      <div class="list-body" :style="{'padding-top': caption != null ? null : '10px'}">
        <div>
          <a class="_500 ng-binding text-ellipsis">${label}</a>
        </div>
        <div v-if="caption != null" class="text-ellipsis text-muted text-sm ng-binding">
          <span>${caption}</span>
        </div>
      </div>
    </div>
  </div>
</div>