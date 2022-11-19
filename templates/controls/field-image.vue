<div class="app-field-parent" v-bind="$attrs">
  <div class="md-form-group app-field-input-container" :field-name="name">
    <div class="app-field-image-container" :style="{'background-color': (current_image != null ? dropColor : null) || '#ffffff', 'border-bottom': state === 'error' ? 'solid 1px #cdcdcd !important' : null}">
      <i v-if="canRemove && current_image != null" style="position: relative; left: 5px; top: -15px" class="pull-right fas app-field-custom-button fa-times" v-on:click="remove()"></i>
      
      <div class="_image" v-if="readonly == null || readonly === false" v-on:click="browse()" v-bind:style="{'background-size' : size, 'background-image': current_image, height:height, width:width}"></div>
      <div class="_image" v-else v-on:click="preview()" v-bind:style="{'background-size' : size, 'background-image': current_image, height:height, width:width, cursor: canPreview === 'true' || canPreview === true ? null : 'default!important'}"></div>
    </div>
    <input class="md-input" style="display: none">
    <label style="width: 100%" v-if="label != null">${label}
      <a v-on:click="preview()" v-if="canPreview === 'true' || canPreview === true" class="pull-right" style="margin-left: 10px"><i class="fa fa-external-link-alt"></i></a>
      <a :href="current_url + '&attachment=' + fileName" v-if="fileName != null" class="pull-right"><i class="fa fa-save"></i></a>
    </label>
  </div>
</div>