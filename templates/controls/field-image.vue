<div class="app-field-parent" v-bind="$attrs">
	<div class="md-form-group app-field-input-container" :field-name="name">
		<div class="app-field-image-container">
		<div class="_image" v-if="readonly == null || readonly === false" v-on:click="browse()" v-bind:style="{'background-size' : size, 'background-image': current_image, height:height, width:width}"></div>
		<div class="_image" v-else v-bind:style="{'background-size' : size, 'background-image': current_image, height:height, width:width, cursor: 'default!important'}" ></div>
		</div>
		<input class="md-input" style="display: none">
		<label>${label}</label>
	</div>
</div>