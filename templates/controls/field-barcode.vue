<div>
	<div v-bind="$attrs" v-if="label == null || label.length === 0">
		<div :field-name="name" v-if="readonly == null || readonly === false" v-on:click="edit()" :id="id" style="cursor: pointer!important">
			<img ref="container" src="" :style="{width: width, height:height, 'max-width': maxWidth, 'max-height':maxHeight}" />
		</div>
		<div :field-name="name" v-else :id="id" style="cursor: default!important">
			<img ref="container" src="" :style="{width: width, height:height, 'max-width': maxWidth, 'max-height':maxHeight}" />
		</div>
	</div>
	<div v-bind="$attrs" class="app-field-parent" v-if="label != null && label.length > 0">
		<div v-bind:class="{'md-form-group' : label != null}" class="app-field-input-container" :field-name="name">
			<div v-if="readonly == null || readonly === false" class="app-field-barcode-container" v-on:click="edit()" :id="id">
				<img ref="container" src="" :style="{width: width, height:height, 'max-width': maxWidth, 'max-height':maxHeight}" />
			</div>
			<div v-else class="app-field-barcode-container" :id="id" style="cursor: default!important">
				<img ref="container" src="" :style="{width: width, height:height, 'max-width': maxWidth, 'max-height':maxHeight}" />
			</div>
			<input class="md-input" style="display: none">
			<label>${label}</label>
		</div>
	</div>
</div>
