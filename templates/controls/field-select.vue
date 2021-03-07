<div v-bind="$attrs" class="app-field-parent" :style="{opacity : opaque === true || opaque === 'true' ? '0.5' : null}">
	<div class="md-form-group app-field-input-container" :field-name="name">
		<input v-if="readonly === 'true' || readonly === true" readonly="true" type="text" class="md-input" :value="selectedValue">
		<select v-else class="md-input" :value="value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus === undefined ? false : focus">
			<option v-if="showFirst === 'true'" disabled :selected="value == null || value === ''" value>- Seleccione -</option>
			<option v-for="(item, ivalue) in items" :selected="value === (item[valueBind || 'key'] || ivalue)" :value="item[valueBind || 'key'] || ivalue">${item[keyBind || 'caption'] || item}</option>
		</select>
		<label>${label}</label>
	</div>
</div>