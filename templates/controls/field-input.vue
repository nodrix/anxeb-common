<div v-bind="$attrs" class="app-field-parent">
  <div class="md-form-group app-field-input-container" :field-name="name" v-if="type === 'calendar'">
    <vc-date-picker :min-date="readonly === 'true' ? date: null" :max-date="readonly === 'true' ? date: null" :update-on-input="false" ref="calendar" mode="single" title-position="left" locale="es" v-model="date" :popover="{placement : calendarPlacement || 'top-end', visibility: 'focus'}" :is-expanded="false">
      <input :spellcheck="spellcheck" v-fill-focus="autoSelect === 'true' || autoSelect === true" style="cursor: pointer" :class="{'text-right':align==='right'}" :style="{color:valueColor, backgroundColor:fillColor, whiteSpace:whiteSpace, fontFamily:fontFamily, 'font-weight': valueWeight}" :readonly="true" type="text" class="md-input" :value="post_value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus === undefined ? false : focus">
    </vc-date-picker>
    <span v-if="readonly !== 'true'" style="position: relative; left: -10px; top:-2px"><i class="fa fa-times _action" style="color:black" v-on:click="clear" v-if="date != null"></i></span>
    <span v-if="readonly !== 'true'" style="position: relative; left: -10px; top:-2px"><i class="fa fa-calendar _action" style="color:black; pointer-events: none;" v-if="date == null"></i></span>
    
    <input :spellcheck="spellcheck" type="hidden" class="md-input">
    <label v-if="label != null" style="width: 100%" :class="{'app-field-label-text-right':align==='right'}">
      ${label}
    </label>
  </div>
  
  <div class="md-form-group app-field-input-container" :field-name="name" v-if="type !== 'calendar'">
    <input :spellcheck="spellcheck" v-fill-focus="autoSelect === 'true' || autoSelect === true" :class="{'text-right':align==='right'}" :style="{color:valueColor, backgroundColor:fillColor, whiteSpace:whiteSpace, fontFamily:fontFamily, 'font-weight': valueWeight}" :readonly="readonly === 'true' || readonly === true" v-if="type !== 'area'" :type="type || 'text'" step="any" v-bind:autocomplete="type === 'password'" class="md-input" :value="post_value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus === undefined ? false : focus" :maxlength="maxLength">
    <textarea :spellcheck="spellcheck" :class="{'text-right':align==='right'}" :style="{height: height, color:valueColor, backgroundColor:fillColor, whiteSpace:whiteSpace, fontFamily:fontFamily, 'font-weight': valueWeight}" :readonly="readonly === 'true' || readonly === true" v-if="type === 'area'" class="md-input" :value="value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus === undefined ? false : focus" :rows="rows" :maxlength="maxLength"></textarea>
    
    <label v-if="label != null" style="width: 100%" :class="{'app-field-label-right':align==='right'}">
      ${label}
      <span v-show="readonly !== 'true' && readonly !== true" class="pull-right text-color" :class="{'text-danger' : value != null && (value.length > maxLength || value.length < (minLength || 0))}" v-if="maxLength !== null && maxLength > 0">${value != null ? value.length : 0} / ${minLength != null ? (minLength + '-') : ''}${maxLength} dígitos</span>
    </label>
  </div>
</div>