<div v-bind="$attrs" class="app-field-parent">
<div class="md-form-group app-field-input-container app-field-lookup-container" :field-name="name">
  <input v-model="presearch" :style="{'padding-right': canCreate ? '26px' : null}" :placeholder="binding && preview != null && binding.preview != null ? preview[binding.preview] : null" v-show="canBrowse" class="md-input app-field-lookup-input" type="text" ref="search" v-on:keyup="searchChanged" v-on:keyup.esc.prevent="cancel" v-on:keyup.enter.prevent="enter" v-on:keydown.down.prevent="down" v-on:keydown.up.prevent="up">

  <i v-if="!canBrowse && notReadOnly && anyValue" :class="{'app-disabled':busy.searching && busy.display}" class="pull-right fas app-field-custom-button fa-times" v-on:click="clear()" ref="browseButton"></i>
  <i v-if="!canBrowse && notReadOnly && !anyValue" :class="{'app-disabled':busy.searching && busy.display}" class="pull-right fas app-field-custom-button fa-search" v-on:click="browse()" ref="browseButton"></i>
  <i style="position: absolute; right: 0px" v-if="canBrowse && notReadOnly && canCreate" :class="{'app-disabled':(busy.searching && busy.display) || presearch == null || presearch.length === 0}" class="fas app-field-custom-button fa-plus" v-on:click="createItem" ref="createButton"></i>

  <div v-if="anyValue && !canBrowse" class="app-field-custom-container">
    <div class="app-field-custom-single pointer" v-on:click="browse()" v-if="notReadOnly">
				<span v-if="binding && binding.preview">
					${preview[binding.preview]}
				</span>
      <span v-else>
					<slot name="preview" v-bind:item="preview"></slot>
				</span>
    </div>
    <div class="app-field-custom-single" v-if="isReadOnly">
				<span v-if="binding && binding.preview">
					${preview[binding.preview]}
				</span>
      <span v-else>
					<slot name="preview" v-bind:item="preview"></slot>
				</span>
    </div>
  </div>

  <div v-if="!anyValue && !canBrowse" class="app-field-custom-container">
    <div v-if="busy.searching && busy.display" class="app-field-custom-single app-field-lookup-busy">
      <span><i class="fas fa-circle-notch fa-spin"></i><span>&nbsp;Buscando...</span></span>
    </div>
    <div v-else class="app-field-custom-single pointer" v-on:click="browse()">
      <span v-if="loaded && notReadOnly">- Buscar -</span>
    </div>
  </div>


  <div class="app-field-custom-browser app-field-lookup" :class="{'app-field-custom-browser-up' : direction === 'up'}" v-show="canBrowse && ((busy.searching && busy.display) || (result != null && result.length > 0) || (createSettings != null) )" ref="box">
    <div class="app-field-custom-top-label" v-if="direction === 'up'">
      ${label}
    </div>

    <div class="list white">
      <div v-if="busy.searching && busy.display" class="app-field-lookup-busy">
        <i class="fas fa-circle-notch fa-spin"></i><span>&nbsp;Buscando...</span>
      </div>
      <div class="app-field-lookup-list" v-if="result != null && result.length > 0">
        <div v-on:click="select(item, true)" v-for="item in result">
          <div class="list-item b-l b-l-2x app-tenant-list-item" :class="{'app-tenant-list-item-selected' : selected != null && selected.id === item.id}">
            <div class="list-left app-list-item-icon">
              <div v-if="$scopedSlots.icon !== undefined">
                <slot name="icon" v-bind:item="item"></slot>
              </div>
              <div v-else class="fa fa-folder"></div>
            </div>
            <div class="list-body" v-if="$scopedSlots.caption != null">
              <div class="app-field-custom-branch">
                <a class="_500 ng-binding" v-if="binding && binding.title">
                  ${item[binding.title]}
                </a>
                <a v-else class="_500 ng-binding">
                  <slot name="title" v-bind:item="item"></slot>
                </a>
              </div>
              <div class="text-ellipsis text-muted text-sm ng-binding">
									<span v-if="binding && binding.caption">
										${item[binding.caption]}
									</span>
                <span v-else>
										<slot name="caption" v-bind:item="item"></slot>
									</span>
              </div>
            </div>
            <div v-else style="padding-top: 9px">
              <a class="_500 ng-binding" v-if="binding && binding.title">
                ${item[binding.title]}
              </a>
              <a v-else class="_500 ng-binding">
                <slot name="title" v-bind:item="item"></slot>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="app-field-custom-none" v-if="createSettings != null">
        <a class="app-label-link" v-on:click="addItem">${createSettings.label}</a>
      </div>
    </div>
  </div>
  <label>${label}</label>
</div>
</div>