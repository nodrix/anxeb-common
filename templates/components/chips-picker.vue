<div v-bind="$attrs" class="app-chips-picker" v-if="items != null">
  
  <div v-if="items.length === 0 && settings && settings.empty" class="app-grid-empty-container" :style="{'margin-top' : settings.empty.offset}">
    <div class="icon">
      <span class="fas" :class="layout && layout.icon ? [layout.icon] : ['fa-exclamation-circle']"></span>
    </div>
    <div class="message">
      <div :style="{'margin-top' : settings.empty.caption ? '' : '11px'}" class="text" v-html="settings.empty.label || 'Lista sin Registros'"></div>
      <a v-if="settings.empty.caption" v-on:click="add()">${settings.empty.caption}</a>
    </div>
  </div>
  <div v-else-if="excluded != null && excluded.length > 0 && filtered.length === 0 && settings && settings.empty" class="app-grid-empty-container" :style="{'margin-top' : settings.empty.offset}">
    <div class="icon">
      <span class="fas" :class="layout && layout.icon ? [layout.icon] : ['fa-exclamation-circle']"></span>
    </div>
    <div class="message">
      <div :style="{'margin-top' : settings.empty.caption ? '' : '11px'}" class="text" v-html="settings.empty.excluded || 'Lista sin Registros'"></div>
      <a v-if="settings.empty.caption" v-on:click="add()">${settings.empty.caption}</a>
    </div>
  </div>
  <div v-else>
    <div class="_container">
        <span v-on:click="pick(item)" v-context-menu="contextMenu ? contextMenu(item) : defaultContextMenu(item)" v-for="item in filtered" :key="item.id" class="_chip" :class="stack ? ['_stack'] : null">
          <i v-if="action && action.left" class="fas _left-icon" :class="[action.icon]"></i>${item.name}<i v-if="action && action.right" class="_right-icon fas" :class="[action.icon]"></i>
        </span>
    </div>
  </div>
</div>