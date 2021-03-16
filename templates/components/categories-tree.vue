<div v-bind="$attrs" class="app-categories-tree">
  <div v-if="categories != null && categories.length > 0">
    
    <category-node :context-menu="contextMenu"
                   :ref="`node_${item.id}`"
                   v-for="item in categories"
                   :key="item.id"
                   api="/categories"
                   :sufix="{caption:(item) => item.attributes > 0 ? item.attributes : null, icon:'fa-vial'}"
                   :item="item"
                   :controller="tree"
                   v-on:select="onSelected"
                   v-on:remove="onRootRemoved">
    </category-node>
  
  </div>
  <div v-else class="app-grid-empty-container">
    <div class="icon">
      <span class="fas fa-info-circle"></span>
    </div>
    <div class="message">
      <div class="text">Sin categorías registradas</div>
      <a v-on:click="add()">Crear nueva</a>
    </div>
  </div>
</div>