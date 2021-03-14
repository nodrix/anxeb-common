<div v-bind="$attrs" class="app-category-node">
  <div v-context-menu="contextMenu(item)" class="_container" :class="{'_selected': $controller && $controller.selected && $controller.selected.id === item.id}" v-on:click="select" v-on:contextmenu="select">
    <div v-on:click.stop="toggle()" :style="{'width' : levelWidth}" style="display: inline-block">&nbsp;</div>
    <span v-on:click.stop="toggle()" v-if="item.childs > 0 && busy === true" class="_icon _busy-icon"><span class="fas fa-circle-notch fa-spin"></span></span>
    <span v-on:click.stop="toggle()" v-else-if="item.childs > 0 && expanded" class="fas fa-caret-down _icon _expanded-icon"></span>
    <span v-on:click.stop="toggle()" v-else-if="item.childs > 0 && !expanded" class="fas fa-caret-right _icon _collapsed-icon"></span>
    <span v-on:click.stop="toggle()" v-else class="_empty-icon fas fa-caret-right _icon _collapsed-icon"></span>
    <span v-on:click.stop="toggle()" class="_count" :class="{'_zero' : item.childs === 0}">${item.childs}</span>
    <span class="_title">${item.name}</span>
    
    <span v-if="sufix != null && sufix.caption(item) != null" style="font-size: 12px; margin-top: 2px" class="text-muted pull-right"><span style="line-height: 1; margin-right: 4px">${sufix.caption(item)}</span><i class="fa" :class="[sufix.icon]"></i></span>
  </div>
  <div class="_sub-nodes-container" v-if="items != null && expanded === true">
    <category-node :context-menu="contextMenu"
                   :ref="`node_${subitem.id}`"
                   v-for="subitem in items"
                   :key="subitem.id"
                   :api="api"
                   :sufix="sufix"
                   :item="subitem"
                   :level="(level || 0) + 1"
                   :offset="offset"
                   :controller="controller"
                   v-on:remove="onChildRemoved">
    </category-node>
  </div>
</div>