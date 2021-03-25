<div class="app-field-parent" v-bind="$attrs">
  <div class="md-form-group app-field-input-container" :field-name="name">
    <div class="app-field-image-container" :style="{'background-color': (current_image != null ? dropColor : null) || '#ffffff', 'border-bottom': state === 'error' ? 'solid 1px #cdcdcd !important' : null}">
      <div class="_image" v-if="readonly == null || readonly === false" v-on:click="browse()" v-bind:style="{'background-size' : size, 'background-image': current_image, height:height, width:width}"></div>
      <div class="_image" v-else v-on:click="preview()" v-bind:style="{'background-size' : size, 'background-image': current_image, height:height, width:width, cursor: canPreview === 'true' || canPreview === true ? null : 'default!important'}"></div>
    </div>
    <input class="md-input" style="display: none">
    <label v-if="label != null">${label}</label>
  </div>
</div>