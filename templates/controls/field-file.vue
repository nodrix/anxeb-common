<div v-bind="$attrs" class="app-field-parent">
	<div class="md-form-group app-field-input-container" :field-name="name">
		<input v-on:click="browse()" style="cursor: pointer" :readonly="true" type="text" class="md-input" :value="post_value" v-on="listener" :id="id" :required="required !== undefined" v-focus="focus !== undefined">
		<span style="position: relative; left: -10px; top:-2px"><i class="fa fa-times _action" style="color:black" v-on:click="clear" v-if="file != null"></i></span>
		<span style="position: relative; left: -10px; top:-2px"><i class="fa fa-search _action" style="color:black; pointer-events: none;" v-if="file == null"></i></span>

		<input type="hidden" class="md-input">
		<label style="width: 100%">
			${label}<span v-if="sizeCaption" style="float: right">${sizeCaption}</span>
		</label>
	</div>
</div>