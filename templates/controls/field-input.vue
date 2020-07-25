<div v-bind="$attrs" class="app-field-parent">
	<div class="md-form-group app-field-input-container" :field-name="name" v-if="type === 'calendar'">
		<vc-date-picker ref="calendar" mode='single' title-position="left" locale="es" v-model="date" :popover="{placement : calendarPlacement || 'top-end', visibility: 'focus'}" :is-expanded="false">
			<input v-fill-focus style="cursor: pointer" :style="{color:valueColor, 'font-weight': valueWeight}" :readonly="true" type="text" class="md-input" :value="post_value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus !== undefined">
		</vc-date-picker>
		<span style="position: relative; left: -10px; top:-2px"><i class="fa fa-times _action" style="color:black" v-on:click="clear" v-if="date != null"></i></span>
		<span style="position: relative; left: -10px; top:-2px"><i class="fa fa-calendar _action" style="color:black; pointer-events: none;" v-if="date == null"></i></span>

		<input type="hidden" class="md-input">
		<label style="width: 100%">
			${label}
		</label>
	</div>

	<div class="md-form-group app-field-input-container" :field-name="name" v-if="type !== 'calendar'">
		<input v-fill-focus :style="{color:valueColor, 'font-weight': valueWeight}" :readonly="readonly === 'true' || readonly === true" v-if="type !== 'area'" :type="type || 'text'" step="any" v-bind:autocomplete="type === 'password'" class="md-input" :value="post_value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus !== undefined" :maxlength="maxLength">
		<textarea :style="{color:valueColor, 'font-weight': valueWeight}" :readonly="readonly === 'true' || readonly === true" v-if="type === 'area'" class="md-input" :value="value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus !== undefined" :rows="rows" :maxlength="maxLength"></textarea>

		<label style="width: 100%">
			${label}
			<span v-show="readonly !== 'true' && readonly !== true" class="pull-right text-color" :class="{'text-danger' : value != null && (value.length > maxLength || value.length < (minLength || 0))}" v-if="maxLength !== null && maxLength > 0">${value != null ? value.length : 0} / ${minLength != null ? (minLength + '-') : ''}${maxLength} dígitos</span>
		</label>
	</div>
</div>