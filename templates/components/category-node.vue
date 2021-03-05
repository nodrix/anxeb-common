<div v-bind="$attrs" class="app-category-node">
  <div class="_container" :class="{'_selected': $controller && $controller.selected && $controller.selected.id === item.id}" v-on:click="select" v-on:contextmenu="select" @contextmenu.prevent="onContextMenu">
    <div v-on:click.stop="toggle()" :style="{'width' : levelWidth}" style="display: inline-block">&nbsp;</div>
    <span v-on:click.stop="toggle()" v-if="item.childs > 0 && busy === true" class="_icon _busy-icon"><span class="fas fa-circle-notch fa-spin"></span></span>
    <span v-on:click.stop="toggle()" v-else-if="item.childs > 0 && expanded" class="fas fa-caret-down _icon _expanded-icon"></span>
    <span v-on:click.stop="toggle()" v-else-if="item.childs > 0 && !expanded" class="fas fa-caret-right _icon _collapsed-icon"></span>
    <span v-on:click.stop="toggle()" v-else class="_empty-icon fas fa-caret-right _icon _collapsed-icon"></span>
    <span v-on:click.stop="toggle()" class="_count" :class="{'_zero' : item.childs === 0}">${item.childs}</span>
    <span class="_title">${item.name}</span>
    
    <actions layout="toolbar" class="pull-right _actions" ref="actions" :offset="{x:364,y:10}">
      <template v-slot:options>
        <slot name="menu" v-bind:row="item"></slot>
      </template>
    </actions>
  </div>
  <div class="_sub-nodes-container" v-if="items != null && expanded === true">
    <category-node :ref="`node_${subitem.id}`" v-for="subitem in items" :key="subitem.id" :api="api" :item="subitem" :level="(level || 0) + 1" :offset="offset" :controller="controller" v-on:remove="onChildRemoved">
      <template v-slot:menu="{row}">
        <slot name="menu" :slot="$slots.menu" v-bind:row="row"></slot>
      </template>
    </category-node>
  </div>
</div>